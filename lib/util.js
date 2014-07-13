/**
 * Simple utility functions
 */

exports.sluggize = function (text) {
  return text.toLowerCase().replace(/[^A-Za-z ]+/g, '').replace(/\s+/g, '-');
};
