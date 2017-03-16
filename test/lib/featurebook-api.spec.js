'use strict';

var EOL = require('os').EOL;

var chai = require('chai');
var expect = chai.expect;

var featurebook = require('./../../lib/featurebook-api');

describe('featurebook-api', function () {

  describe('#featurebook', function () {

    it('should export node type constants', function () {
      expect(featurebook.NODE_FILE).to.equal('file');
      expect(featurebook.NODE_DIRECTORY).to.equal('directory');
    });

  });

  describe('#getVersion', function () {
    it('should return version of this API', function () {
      expect(featurebook.getVersion()).to.equal(require('./../../package.json').version);
    });
  });

  describe('#readSpecTreeSync', function () {

    it('should return specification tree object', function () {
      var specTree = featurebook.readSpecTreeSync('test/resources/specs/tiny');
      expectTinySpecTree(specTree);
    });

  });

  describe('#readSpecTree', function () {

    it('should propagate specification tree object', function (done) {
      featurebook.readSpecTree('test/resources/specs/tiny', function (err, specTree) {
        expect(err).to.be.null;
        expectTinySpecTree(specTree);
        done();
      });
    });

  });

  describe('#readMetadataSync', function () {

    it('should return null given a specification directory without the metadata descriptor', function () {
      var metadata = featurebook.readMetadataSync('test/resources/features');
      expect(metadata).to.be.null;
    });

    it('should return the metadata object given a specification directory with the metadata descriptor', function () {
      var metadata = featurebook.readMetadataSync('test/resources/specs/tiny');
      expect(metadata).to.deep.equal({title: 'Tiny Specification', version: 'v1.0.3'});
    });

  });

  describe('#readMetadata', function () {

    it('should propagate null given a specification directory without the metadata descriptor', function (done) {
      featurebook.readMetadata('test/resources/features', function (err, metadata) {
        expect(err).to.be.null;
        expect(metadata).to.be.null;
        done();
      });
    });

    it('should propagate the metadata object given a specification directory with the metadata descriptor', function (done) {
      featurebook.readMetadata('test/resources/specs/tiny', function (err, metadata) {
        expect(metadata).to.deep.equal({title: 'Tiny Specification', version: 'v1.0.3'});
        done();
      });
    });

  });

  describe('#readFeatureSync', function () {

    it('should throw an error given a non-existent feature file', function () {
      expect(function () {
        featurebook.readFeatureSync('__nonexistentfeaturefile__');
      }).to.throw(Error);
    });

    it('should throw an error given an unparsable feature file', function () {
      expect(function () {
        featurebook.readFeatureSync('test/resources/features/unparsable.feature');
      }).to.throw();
    });

    it('should return the feature object given a valid feature file', function () {
      var feature = featurebook.readFeatureSync('test/resources/features/simple.feature');
      expectSampleFeature(feature);
    });

  });

  describe('#readFeature', function () {

    it('should propagate an error given a non-existent feature file', function (done) {
      featurebook.readFeature('__nonexistentfeaturefile__', function (err) {
        expect(err).to.exist;
        done();
      });
    });

    it('should propagate an error given an unparsable feature file', function (done) {
      featurebook.readFeature('test/resources/features/unparsable.feature', function (err) {
        expect(err).to.exist;
        done();
      });
    });

    it('should propagate the feature object given a valid feature file', function (done) {
      featurebook.readFeature('test/resources/features/simple.feature', function (err, feature) {
        expect(err).to.not.exist;
        expectSampleFeature(feature);
        done();
      });
    });

  });

  describe('#readSummarySync', function () {

    it('should return null given a directory without the summary file', function () {
      var summary = featurebook.readSummarySync('__nonexistentsummaryfile_');
      expect(summary).to.be.null;
    });

    it('shoud return contents given a directory with the summary file', function () {
      var summary = featurebook.readSummarySync('test/resources/specs/tiny');
      expect(summary).to.equal('# Tiny Specification' + EOL);
    });

  });

  describe('#readSummary', function () {

    it('should propagate null given a directory without the summary file', function (done) {
      featurebook.readSummary('__nonexistentsummaryfile_', function (err, summary) {
        expect(err).to.be.null;
        expect(summary).to.be.null;
        done();
      });
    });

    it('should propagate contents given a directory with the summary file', function (done) {
      featurebook.readSummary('test/resources/specs/tiny', function (err, summary) {
        expect(err).to.be.null;
        expect(summary).to.equal('# Tiny Specification' + EOL);
        done();
      });
    });

  });

  function expectSampleFeature(feature) {
    expect(feature.type).to.equal('Feature');
    expect(feature.name).to.equal('Simple feature');
    expect(feature.keyword).to.equal('Feature');

    expect(feature.scenarioDefinitions).to.have.deep.property('[0].type', 'Scenario');
    expect(feature.scenarioDefinitions).to.have.deep.property('[0].name', 'Simple scenario');
    expect(feature.scenarioDefinitions).to.have.deep.property('[0].keyword', 'Scenario');

    expect(feature.scenarioDefinitions).to.have.deep.property('[0].steps[0].type', 'Step');
    expect(feature.scenarioDefinitions).to.have.deep.property('[0].steps[0].keyword', 'Given ');
    expect(feature.scenarioDefinitions).to.have.deep.property('[0].steps[0].text', 'step 1');

    expect(feature.scenarioDefinitions).to.have.deep.property('[0].steps[1].type', 'Step');
    expect(feature.scenarioDefinitions).to.have.deep.property('[0].steps[1].keyword', 'When ');
    expect(feature.scenarioDefinitions).to.have.deep.property('[0].steps[1].text', 'step 2');

    expect(feature.scenarioDefinitions).to.have.deep.property('[0].steps[2].type', 'Step');
    expect(feature.scenarioDefinitions).to.have.deep.property('[0].steps[2].keyword', 'Then ');
    expect(feature.scenarioDefinitions).to.have.deep.property('[0].steps[2].text', 'step 3');
  }

  function expectTinySpecTree(specTree) {
    expect(specTree).to.deep.equal({
      "path": ".",
      "name": "tiny",
      "displayName": "Tiny",
      "type": "directory",
      "children": [
        {
          "path": "section-a",
          "name": "section-a",
          "displayName": "Section-a",
          "type": "directory",
          "children": [
            {
              "path": "section-a/file-a.feature",
              "name": "file-a.feature",
              "displayName": "File-a",
              "type": "file"
            },
            {
              "path": "section-a/file-b.feature",
              "name": "file-b.feature",
              "displayName": "File-b",
              "type": "file"
            },
            {
              "path": "section-a/section-b",
              "name": "section-b",
              "displayName": "Section-b",
              "type": "directory",
              "children": [
                {
                  "path": "section-a/section-b/file-c.feature",
                  "name": "file-c.feature",
                  "displayName": "Feature C Overwrite",
                  "type": "file"
                }
              ]
            }
          ]
        },
        {
          "path": "section-c",
          "name": "section-c",
          "displayName": "Section-c",
          "type": "directory",
          "children": [
            {
              "path": "section-c/file-d.feature",
              "name": "file-d.feature",
              "displayName": "Feature D Overwrite",
              "type": "file"
            }
          ]
        }
      ]
    });
  }

});
