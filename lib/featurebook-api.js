'use strict';

var pkg = require('../package.json');
var constants = require('./constants');
var walker = require('./dir-walker');
var gherkin = require('featurebook-gherkin');
var fs = require('fs');
var path = require('path');
var minimatch = require('minimatch');
var ignoreFile = require('./ignore-file');

module.exports = {
  NODE_FILE: constants.NODE_FILE,
  NODE_DIRECTORY: constants.NODE_DIRECTORY,

  getVersion: getVersion,
  readSpecTree: readSpecTree,
  readSpecTreeSync: readSpecTreeSync,
  readMetadata: readMetadata,
  readMetadataSync: readMetadataSync,
  readFeature: readFeature,
  readFeatureSync: readFeatureSync,
  readSummary: readSummary,
  readSummarySync: readSummarySync
};

function getVersion() {
  return pkg.version;
}

function readSpecTree(specDir, callback) {
  ignoreFile.getPatterns(specDir, function (err, patterns) {
    if (err) {
      return callback(err);
    }
    walker.findTree(specDir, ignoredFilesFilter(patterns), function (ex, specTree) {
      if (ex) {
        return callback(ex);
      }
      callback(null, specTree);
    });
  });
}

function readSpecTreeSync(specDir) {
  var ignorePatterns = ignoreFile.getPatternsSync(specDir);
  return walker.findTreeSync(specDir, ignoredFilesFilter(ignorePatterns));
}

function readMetadata(specDir, callback) {
  var metadataFile = path.join(specDir, constants.DEFAULT_METADATA_FILE_NAME);

  fs.stat(metadataFile, function (err) {
    if (err) {
      return callback(null, null);
    } else {
      fs.readFile(metadataFile, constants.DEFAULT_FILE_ENCODING, function (ex, metadataFileContents) {
        if (ex) {
          return callback(err);
        } else {
          return callback(null, JSON.parse(metadataFileContents));
        }
      });
    }
  });
}

function readMetadataSync(specDir) {
  var metadataFile = path.join(specDir, constants.DEFAULT_METADATA_FILE_NAME);
  try {
    fs.statSync(metadataFile);
    return JSON.parse(fs.readFileSync(metadataFile, constants.DEFAULT_FILE_ENCODING));
  } catch (err) {
    return null;
  }
}

function readFeature(featureFile, callback) {
  fs.readFile(featureFile, constants.DEFAULT_FILE_ENCODING, function (err, contents) {
    if (err) {
      return callback(err);
    }
    try {
      return callback(null, gherkin.parse(contents));
    } catch (ex) {
      return callback(ex);
    }
  });
}

function readFeatureSync(featureFile) {
  return gherkin.parse(fs.readFileSync(featureFile, constants.DEFAULT_FILE_ENCODING));
}

function readSummary(dir, callback) {
  var summaryFile = path.join(dir, constants.DEFAULT_SUMMARY_FILE_NAME);

  fs.stat(summaryFile, function (err) {
    if (err) {
      return callback(null, null);
    } else {
      fs.readFile(summaryFile, constants.DEFAULT_FILE_ENCODING, function (err, summary) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, summary);
        }
      });
    }
  });
}

function readSummarySync(dir) {
  var summaryFile = path.join(dir, constants.DEFAULT_SUMMARY_FILE_NAME);

  if (fs.existsSync(summaryFile)) {
    return fs.readFileSync(summaryFile, constants.DEFAULT_FILE_ENCODING);
  }
  return null;
}

function ignoredFilesFilter(patterns) {
  return function (dir, file) {
    var fullPath = path.join(dir, file);
    for (var i = 0; i < patterns.length; i++) {
      var pattern = patterns[i];
      if (minimatch(fullPath, pattern) || minimatch(file, pattern)) {
        return false;
      }
    }
    return true;
  };
}
