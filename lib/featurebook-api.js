'use strict';

var DEFAULT_FILE_ENCODING = 'UTF-8';

var gherkin = require('featurebook-gherkin');
var fs = require('fs');

module.exports = {
  getVersion: getVersion,
  readFeature: readFeature,
  readFeatureSync: readFeatureSync
};

function getVersion() {
  return require('./../package.json').version;
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
