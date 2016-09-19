'use strict';

var DEFAULT_FILE_ENCODING = 'UTF-8';
var DEFAULT_METADATA_FILE_NAME = 'featurebook.json';
var DEFAULT_SUMMARY_FILE_NAME = 'SUMMARY.md';
var DEFAULT_IGNORE_FILE_NAME = '.featurebookignore';
var DEFAULT_ASSETS_DIR = 'assets';
var DEFAULT_DIST_DIR = 'dist';
var GIT_REPO_DIR = '.git';

var DEFAULT_IGNORE_PATTERNS = [
  DEFAULT_METADATA_FILE_NAME,
  DEFAULT_SUMMARY_FILE_NAME,
  DEFAULT_IGNORE_FILE_NAME,
  DEFAULT_ASSETS_DIR,
  DEFAULT_DIST_DIR,
  GIT_REPO_DIR
];

var fs = require('fs');
var path = require('path');

function getPatterns(specDir, cb) {
  var file = path.join(specDir, DEFAULT_IGNORE_FILE_NAME);
  fs.stat(file, function (err) {
    if (err) {
      return cb(null, DEFAULT_IGNORE_PATTERNS);
    } else {
      fs.readFile(file, DEFAULT_FILE_ENCODING, function (err, fileContents) {
        if (err) {
          return cb(err);
        } else {
          return cb(null, DEFAULT_IGNORE_PATTERNS.concat(parse(fileContents)));
        }
      });
    }
  });
}

function getPatternsSync(specDir) {
  var file = path.join(specDir, DEFAULT_IGNORE_FILE_NAME);
  try {
    fs.statSync(file);
    var fileContent = fs.readFileSync(file, DEFAULT_FILE_ENCODING);
    return DEFAULT_IGNORE_PATTERNS.concat(parse(fileContent));
  } catch (err) {
    return DEFAULT_IGNORE_PATTERNS;
  }
}

function parse(fileContent) {
  return fileContent.split('\n').map(function (line) {
    return line.trim();
  }).filter(function (line) {
    return '' !== line;
  });
}

module.exports = {
  getPatterns: getPatterns,
  getPatternsSync: getPatternsSync
};
