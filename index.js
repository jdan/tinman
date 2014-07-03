var fs = require('fs');
var path = require('path');
var ncp = require('ncp');
var Blog = require('./lib/blog');

/**
 * Create and return an express web server
 */
exports.createServer = function (options) {
  /* Create a new Tinman instance and run it */
  var instance = new Tinman(options);
  instance.run();

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


/**
 * Create an example blog
 */
exports.create = function (title, callback) {
  var cwd = path.resolve();

  fs.mkdir(title, function (err) {
    if (err) throw err;
    ncp(path.join(__dirname, 'example'), title, callback);
  });
};
