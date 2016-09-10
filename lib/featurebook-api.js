'use strict';

var DEFAULT_FILE_ENCODING = 'UTF-8';
var DEFAULT_METADATA_FILE_NAME = 'featurebook.json';
var DEFAULT_SUMMARY_FILE_NAME = 'SUMMARY.md';
var DEFAULT_IGNORE_FILE_NAME = '.featurebookignore';
var DEFAULT_ASSETS_DIR = 'assets';
var DEFAULT_DIST_DIR = 'dist';
var GIT_REPO_DIR = '.git';

var walker = require('./dir-walker');
var gherkin = require('featurebook-gherkin');
var fs = require('fs');
var path = require('path');

module.exports = {
  NODE_FILE: 'file',
  NODE_DIRECTORY: 'directory',

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
  return require('./../package.json').version;
}

function readSpecTree(specDir, callback) {
  walker.findTree(specDir, ignoredFilesFilter, function (err, specTree) {
    if (err) {
      throw err;
    }
    callback(null, specTree);
  });
}

function readSpecTreeSync(specDir) {
  return walker.findTreeSync(specDir, ignoredFilesFilter);
}

function readMetadata(specDir, callback) {
  var metadataFile = path.join(specDir, DEFAULT_METADATA_FILE_NAME);

  fs.stat(metadataFile, function (err) {
    if (err) {
      return callback(null, null);
    } else {
      fs.readFile(metadataFile, DEFAULT_FILE_ENCODING, function (err, metadataFileContents) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, JSON.parse(metadataFileContents));
        }
      });
    }
  });
}

function readMetadataSync(specDir) {
  var metadataFile = path.join(specDir, DEFAULT_METADATA_FILE_NAME);
  try {
    fs.statSync(metadataFile);
    return JSON.parse(fs.readFileSync(metadataFile, DEFAULT_FILE_ENCODING));
  } catch (err) {
    return null;
  }
}

function readFeature(featureFile, callback) {
  fs.readFile(featureFile, DEFAULT_FILE_ENCODING, function (err, contents) {
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
  return gherkin.parse(fs.readFileSync(featureFile, DEFAULT_FILE_ENCODING));
}

function readSummary(dir, callback) {
  var summaryFile = path.join(dir, DEFAULT_SUMMARY_FILE_NAME);

  fs.stat(summaryFile, function (err) {
    if (err) {
      return callback(null, null);
    } else {
      fs.readFile(summaryFile, DEFAULT_FILE_ENCODING, function (err, summary) {
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
  var summaryFile = path.join(dir, DEFAULT_SUMMARY_FILE_NAME);

  if (fs.existsSync(summaryFile)) {
    return fs.readFileSync(summaryFile, DEFAULT_FILE_ENCODING);
  }
  return null;
}

function ignoredFilesFilter(f) {
  // TODO Filter out files according to the .featurebookignore file
  return f !== DEFAULT_METADATA_FILE_NAME
    && f !== DEFAULT_SUMMARY_FILE_NAME
    && f !== DEFAULT_IGNORE_FILE_NAME
    && f !== DEFAULT_ASSETS_DIR
    && f !== DEFAULT_DIST_DIR
    && f !== GIT_REPO_DIR;
}
