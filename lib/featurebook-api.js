'use strict';

var DEFAULT_FILE_ENCODING = 'UTF-8';
var DEFAULT_METADATA_FILE_NAME = 'featurebook.json';
var DEFAULT_SUMMARY_FILE_NAME = 'SUMMARY.md';

var gherkin = require('featurebook-gherkin');
var fs = require('fs');
var path = require('path');

module.exports = {
  getVersion: getVersion,
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

function readMetadata(specDir, callback) {
  var metadataFile = path.join(specDir, DEFAULT_METADATA_FILE_NAME);

  fs.stat(metadataFile, function (err) {
    if (err) {
      callback(null, null);
    } else {
      fs.readFile(metadataFile, DEFAULT_FILE_ENCODING, function (err, metadataFileContents) {
        if (err) {
          callback(err);
        } else {
          callback(null, JSON.parse(metadataFileContents));
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
      callback(err);
      return;
    }
    try {
      callback(null, gherkin.parse(contents));
    } catch (err) {
      callback(err);
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
      callback(null, null);
    } else {
      fs.readFile(summaryFile, DEFAULT_FILE_ENCODING, function (err, summary) {
        if (err) {
          callback(err);
        } else {
          callback(null, summary);
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
