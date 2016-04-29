'use strict';

var chai = require('chai');
var expect = chai.expect;

var featurebook = require('./../../lib/featurebook-api');

describe('featurebook-api', function () {

  describe('#getVersion', function () {
    it('should return version of this API', function () {
      expect(featurebook.getVersion()).to.equal(require('./../../package.json').version);
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

});
