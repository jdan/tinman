var fs = require('fs');
var path = require('path');
var async = require('async');
var ejs = require('ejs');
var express = require('express');
var fm = require('front-matter');
var gs = require('glob-stream');
var marked = require('marked');
var mkdirp = require('mkdirp');
var ncp = require('ncp');
var strftime = require('strftime');
var util = require('./lib/util');

function Tinman(options) {
  options = options || {};
  for (var prop in Tinman.DEFAULTS) {
    /* Won't work for a falsey option */
    options[prop] = options[prop] || Tinman.DEFAULTS[prop];
  }

  this.title = options.title;
  this.directory = path.resolve(options.directory);

  /* Directory and full path to articles */
  this.articlesDir = options.articles;

  /* Directory and full path to public files */
  this.publicDir = options.public;

  this.layoutTemplate = fs.readFileSync(options.layout, 'utf-8');
  this.articleTemplate = fs.readFileSync(options.template, 'utf-8');
  this.indexTemplate = fs.readFileSync(options.index, 'utf-8');

  /**
   * Define some instance variables:
   * - an array of article objects
   * - the HTML content of the index page
   * - the express server
   */
  this.articles = [];
  this.indexPage = null;
  this.server = express();
}


Tinman.DEFAULTS = {
  title: path.basename(process.cwd()),
  directory: '.',
  articles: 'articles',
  public: 'public',
  layout: path.resolve(__dirname, 'templates/layout.ejs'),
  template: path.resolve(__dirname, 'templates/article.ejs'),
  index: path.resolve(__dirname, 'templates/index.ejs')
};


/**
 * Run the tinman instance
 */
Tinman.prototype.run = function (callback) {
  return async.series([
    /* Generate CSS and JS tags for the main layout */
    this.generateResourceTags.bind(this),

    /* Load and render the articles */
    this.loadArticles.bind(this),

    /* Render the index page */
    this.loadIndexPage.bind(this),

    /* Configure the routes for the express server */
    this.configRoutes.bind(this)
  ], callback);
};


/**
 * Generates CSS and JS tags based on files located in the specified
 * public directory. Then we build a render method to place any content
 * into our main layout.
 */
Tinman.prototype.generateResourceTags = function (callback) {
  var self = this;
  var styles = [];
  var scripts = [];

  var styleGlob = path.join(this.directory, this.publicDir, '**', '*.css');
  var scriptGlob = path.join(this.directory, this.publicDir, '**', '*.js');

  var stream = gs.create([styleGlob, scriptGlob]);
  stream.on('data', function (file) {
    var relative = path.relative(file.base, file.path);

    if (path.extname(file.path) === '.js') {
      scripts.push(relative);
    } else if (path.extname(file.path) === '.css') {
      styles.push(relative);
    }
  });

  stream.on('end', function () {
    scripts = scripts.map(function (asset) {
      return '<script src="/' + asset + '"></script>';
    });

    styles = styles.map(function (asset) {
      return '<link rel="stylesheet" href="/' + asset + '">';
    });

    self.renderPage = function (options) {
      options.title = self.title;
      options.stylesheets = styles.join('\n');
      options.scripts = scripts.join('\n');

      return ejs.render(self.layoutTemplate, options);
    };

    callback();
  });
};


/**
 * Load the articles from the user-specified direction, and render them
 */
Tinman.prototype.loadArticles = function (callback) {
  var self = this;
  var fullPath = path.join(this.directory, this.articlesDir);

  if (!fs.existsSync(fullPath)) {
    return callback(new Error("Articles directory: " + fullPath + " not found"));
  }

  fs.readdir(fullPath, function (err, files) {
    if (err) return callback(err);
    var i, ops = [];

    for (i = 0; i < files.length; i++) {
      ops.push(self.renderArticle(files[i]));
    }

    /* Sort the articles */
    async.parallel(ops, function (err) {
      if (err) return callback(err);

      self.articles = self.articles.reverse();
      callback();
    });
  });
};


/**
 * Render an article specified by a file path
 */
Tinman.prototype.renderArticle = function (file) {
  var self = this;

  return function (callback) {
    var filePath = path.join(self.directory, self.articlesDir, file);

    fs.readFile(filePath, function (err, data) {
      if (err) return callback(err);

      /**
       * Parse the front-matter of the article, which returns an object
       * with `attributes` and `body`.
       *
       * We strip out the attributes and nest body inside of it, allowing
       * us to later reference things like "article.date" instead of
       * "article.attributes.date"
       */
      var parsedArticle = fm(data.toString());
      var article = parsedArticle.attributes;

      /* Render the markdown of the body */
      article.title = article.title || 'Untitled';
      article.body = marked(parsedArticle.body);

      /* Render the summary as the first paragraph of the article */
      var paragraphBreak = parsedArticle.body.indexOf("\n\n");
      if (paragraphBreak > -1) {
        article.summary = marked(parsedArticle.body.slice(0, paragraphBreak));
      } else {
        article.summary = article.body;
      }

      /**
       * The slug defaults to the sluggized title as defined in
       * lib/util.js.
       *
       * i.e. sluggize('Hello, World!') => hello-world
       */
      article.slug = article.slug || util.sluggize(article.title);

      /* The route (or route) defaults to /[slug] */
      article.route = article.route || '/' + article.slug;

      /* Render the article with the template and layout */
      article.render = self.renderPage({
        body: ejs.render(self.articleTemplate, article)
      });

      self.articles.push(article);
      return callback(null, article);
    });
  };
};


/**
 * Render the index page
 */
Tinman.prototype.loadIndexPage = function (callback) {
  this.indexPage = this.renderPage({
    body: ejs.render(this.indexTemplate, { articles: this.articles })
  });

  callback();
};


/**
 * Configure the routes to the index page and each article
 */
Tinman.prototype.configRoutes = function (callback) {
  var i, self = this;

  /* Use the static middleware on the specified public directory */
  this.server.use(express.static(path.join(this.directory, this.publicDir)));

  /* Configure index route */
  this.server.get('/', function (req, res) {
    res.send(self.indexPage);
  });

  this.articles.forEach(function (article) {
    /**
     * Set the route as either the articles "route" property, or as its
     * basename (filename without extension)
     *
     * TODO: json endpoint
     */
    self.server.get(article.route, function (req, res) {
      /* Render the article template */
      res.send(article.render);
    });
  });

  return callback();
};


/**
 * Export the blog as a static site
 */
Tinman.prototype.export = function (destination, callback) {
  var self = this, ops = [];
  destination = destination || 'build';

  /* Create the destination direction */
  mkdirp(destination, function (err) {
    if (err) return callback(err);

    /* Push an operation to write the index page */
    ops.push(function (callback) {
      fs.writeFile(path.join(destination, 'index.html'), self.indexPage, callback);
    });

    /* Write the public directory */
    ops.push(function (callback) {
      ncp(path.join(self.directory, self.publicDir), destination, callback);
    });

    /* Push an operation to write each artle in parallel */
    self.articles.forEach(function (article) {
      ops.push(self.exportArticle(destination, article));
    });

    return async.parallel(ops, callback);
  });
};


/**
 * Returns a function to export an article to a given destination
 */
Tinman.prototype.exportArticle = function (destination, article) {
  return function (callback) {
    var articlePath = path.join(destination, article.route);
    /* Create the path for the article */
    mkdirp(articlePath, function (err) {
      if (err) return callback(err);

      /* Write index.html to the directory identifying the article */
      fs.writeFile(path.join(articlePath, 'index.html'), article.render, callback);
    });
  };
};


/*** Exports ***/


/* Expose the Tinman class */
exports.Tinman = Tinman;


/**
 * Simple helper function to read the tinman config file
 */
exports.readConfig = function () {
  var configFile = 'tinman.json';

  if (!fs.existsSync(configFile)) {
    return {};
  } else {
    return JSON.parse(fs.readFileSync(configFile));
  }
};


/**
 * Create and return an express web server
 */
exports.createServer = function (options) {
  /* Create a new Tinman instance and run it */
  var instance = new Tinman(options);
  instance.run(function (err) {
    if (err) throw err;
  });

  /* Return the express server */
  return instance.server;
};


/**
 * Generate a static site to a given destination
 */
exports.build = function (options, destination, callback) {
  var instance = new Tinman(options);

  instance.run(function (err) {
    if (err) return callback(err);

    instance.export(destination, callback);
  });
};


/**
 * Create an example blog
 */
exports.createBlog = function (title, withTemplates, callback) {
  var cwd = path.resolve();
  var ops = [];

  fs.mkdir(title, function (err) {
    if (err) throw err;
    ops.push(function (done) {
      ncp(path.join(__dirname, 'example'), title, done);
    });

    if (withTemplates) {
      /* copy the templates directory */
      ops.push(function (done) {
        var templateDir = path.join(title, 'templates');
        fs.mkdirSync(templateDir);
        ncp(path.join(__dirname, 'templates'), templateDir, done);
      });

      /* Generate a tinman.json */
      var tinmanJson = JSON.stringify({
        title: title,
        template: 'templates/article.ejs',
        index: 'templates/index.ejs',
        layout: 'templates/layout.ejs'
      }, null, 2) + '\n';

      ops.push(function (done) {
        fs.writeFile(path.join(title, 'tinman.json'), tinmanJson, done);
      });
    }

    return async.parallel(ops, callback);
  });
};


/**
 * Create a new article
 */
exports.createArticle = function (title, callback) {
  var now = new Date();
  var slug = util.sluggize(title);
  var date = strftime('%F');

  /* Read in the articles directory specified in the config */
  var articlesDir = exports.readConfig().articles || Tinman.DEFAULTS.articles;

  var filename = path.join(articlesDir, date + '-' + slug + '.md');
  var contents = [
    '---',
    'title: ' + title,
    'date: ' + date,
    'slug: ' + slug,
    '---',
    '',
    'Once upon a time...'
  ].join('\n');

  return fs.writeFile(filename, contents, function (err) {
    if (err) return callback(err);

    callback(null, filename);
  });
};
