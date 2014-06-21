var fs = require('fs');
var path = require('path');

var async = require('async');
var ejs = require('ejs');
var express = require('express');
var fm = require('front-matter');
var marked = require('marked');

function Tinman(options) {
  for (var prop in Tinman.DEFAULTS) {
    /* Won't work for a falsey option */
    options[prop] = options[prop] || Tinman.DEFAULTS[prop];
  }

  this.articlesDir = options.articles;
  this.publicDir = options.public;

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

  this.server = express();
  this.server.use(express.static(this.publicDir));

  async.series([
    this.loadArticles.bind(this),
    this.routeArticles.bind(this)
  ], function (err) {
    if (err) throw err;
  });
}

Tinman.DEFAULTS = {
  articles: 'articles',
  public: 'public',
  layout: path.join(__dirname, 'templates/layout.ejs'),
  template: path.join(__dirname, 'templates/article.ejs'),
  index: path.join(__dirname, 'templates/index.ejs')
};

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

      /* Render the article with the template and layout */
      article.render = self.renderPage({
        body: ejs.render(self.articleTemplate, article)
      });

      self.articles.push(article);
      return callback(null, article);
    });
  };
};

Tinman.prototype.routeArticles = function (callback) {
  var i, self = this;

  for (i = 0; i < this.articles.length; i++) {
    (function (article) {
      /* Preserve article with a closure */

      /**
       * Set the route as either the articles "location" property, or as its
       * basename (filename without extension)
       */
      var route = article.location || '/' + article.basename;
      self.server.get(route, function (req, res) {
        /* Render the article template */
        res.send(article.render);
      });
    })(this.articles[i]);
  }

  return callback();
};

exports.createServer = function (options) {
  /* Create a new Tinman instance */
  var instance = new Tinman(options);

  /* Return the express server */
  return instance.server;
};
