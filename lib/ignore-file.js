'use strict';

var fs = require('fs');
var path = require('path');
var constants = require('./constants');

var DEFAULT_IGNORE_PATTERNS = [
  constants.DEFAULT_METADATA_FILE_NAME,
  constants.DEFAULT_SUMMARY_FILE_NAME,
  constants.DEFAULT_IGNORE_FILE_NAME,
  constants.DEFAULT_ASSETS_DIR,
  constants.DEFAULT_DIST_DIR,
  constants.GIT_REPO_DIR
];

function getPatterns(specDir, cb) {
  var file = path.join(specDir, constants.DEFAULT_IGNORE_FILE_NAME);
  fs.stat(file, function (err) {
    if (err) {
      return cb(null, DEFAULT_IGNORE_PATTERNS);
    } else {
      fs.readFile(file, constants.DEFAULT_FILE_ENCODING, function (ex, fileContents) {
        if (ex) {
          return cb(ex);
        } else {
          return cb(null, DEFAULT_IGNORE_PATTERNS.concat(parse(fileContents)));
        }
      });
    }
  });
}

function getPatternsSync(specDir) {
  var file = path.join(specDir, constants.DEFAULT_IGNORE_FILE_NAME);
  try {
    fs.statSync(file);
    var fileContent = fs.readFileSync(file, constants.DEFAULT_FILE_ENCODING);
    return DEFAULT_IGNORE_PATTERNS.concat(parse(fileContent));
  } catch (err) {
    return DEFAULT_IGNORE_PATTERNS;
  }
}

function parse(fileContent) {
  return fileContent.split('\n').map(function (line) {
    return line.trim();
  }).filter(function (line) {
    return '' !== line && !line.startsWith('#');
  });
}

module.exports = {
  getPatterns: getPatterns,
  getPatternsSync: getPatternsSync
};
