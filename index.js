var fs = require('fs');
var path = require('path');

var async = require('async');
var ejs = require('ejs');
var express = require('express');
var fm = require('front-matter');
var marked = require('marked');
var mkdirp = require('mkdirp');

function Tinman(options) {
  options = options || {};
  for (var prop in Tinman.DEFAULTS) {
    /* Won't work for a falsey option */
    options[prop] = options[prop] || Tinman.DEFAULTS[prop];
  }

  this.directory = path.resolve(options.directory);
  this.articlesDir = path.join(this.directory, options.articles);
  this.publicDir = path.join(this.directory, options.public);

  this.layoutTemplate = fs.readFileSync(options.layout, 'utf-8');
  this.articleTemplate = fs.readFileSync(options.template, 'utf-8');
  this.indexTemplate = fs.readFileSync(options.index, 'utf-8');

  /**
   * Create a render function that places a given `body` into the layout
   * template.
   *
   * TODO: Pre-render CSS and JS includes
   */
  this.renderPage = ejs.compile(this.layoutTemplate);

  this.articles = [];
  this.indexPage = null;

  this.server = express();
  this.server.use(express.static(this.publicDir));
}


Tinman.DEFAULTS = {
  directory: '.',
  articles: 'articles',
  public: 'public',
  layout: path.join(__dirname, 'templates/layout.ejs'),
  template: path.join(__dirname, 'templates/article.ejs'),
  index: path.join(__dirname, 'templates/index.ejs')
};


/**
 * Run the tinman instance
 * - load the articles from a user-specified location
 * - generate the index page
 * - configure the routes for the express server
 */
Tinman.prototype.run = function (callback) {
  return async.series([
    this.loadArticles.bind(this),
    this.loadIndexPage.bind(this),
    this.configRoutes.bind(this)
  ], callback);
};


/**
 * Load the articles from the user-specified direction, and render them
 */
Tinman.prototype.loadArticles = function (callback) {
  var self = this;

  fs.readdir(this.articlesDir, function (err, files) {
    if (err) return callback(err);
    var i, ops = [];

    for (i = 0; i < files.length; i++) {
      ops.push(self.renderArticle(files[i]));
    }

    async.parallel(ops, callback);
  });
};


/**
 * Render an article specified by a file path
 */
Tinman.prototype.renderArticle = function (file) {
  var self = this;

  return function (callback) {
    var filePath = path.join(self.articlesDir, file);

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

      article.basename = path.basename(file, path.extname(file));
      /* Render the markdown of the body */
      article.title = article.title || 'Untitled';
      article.body = marked(parsedArticle.body);
      article.location = article.location || '/' + article.basename;

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

  /* Configure index route */
  this.server.get('/', function (req, res) {
    res.send(self.indexPage);
  });

  for (i = 0; i < this.articles.length; i++) {
    (function (article) {
      /* Preserve article with a closure */

      /**
       * Set the route as either the articles "location" property, or as its
       * basename (filename without extension)
       *
       * TODO: json endpoint
       */
      self.server.get(article.location, function (req, res) {
        /* Render the article template */
        res.send(article.render);
      });
    })(this.articles[i]);
  }

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
    var articlePath = path.join(destination, article.location);
    /* Create the path for the article */
    mkdirp(articlePath, function (err) {
      if (err) return callback(err);

      /* Write index.html to the directory identifying the article */
      fs.writeFile(path.join(articlePath, 'index.html'), article.render, callback);
    });
  };
};


/**
 * Create and return an express web server
 */
exports.createServer = function (options) {
  /* Create a new Tinman instance and run it */
  var instance = new Tinman(options).run();

  /* Return the express server */
  return instance.server;
};


/**
 * Generate a static site to a given destination
 */
exports.build = function (options, destination) {
  var instance = new Tinman(options);

  instance.run(function () {
    return instance.export(destination, function (err) {
      if (err) throw err;
    });
  });
};
