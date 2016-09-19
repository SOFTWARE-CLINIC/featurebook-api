'use strict';

var chai = require('chai');
var expect = chai.expect;
var ignoreFile = require('../../lib/ignore-file');

describe('ignore-file', function () {

  describe('#getPatterns', function () {

    it('should return default ignore path patterns', function (done) {
      ignoreFile.getPatterns('test/resources/features', function (err, patterns) {
        expect(err).to.be.null;
        expect(patterns).to.deep.equal([
          "featurebook.json",
          "SUMMARY.md",
          ".featurebookignore",
          "assets",
          "dist",
          ".git"
        ]);
        done();
      });
    });

    it('should return ignore path patterns', function (done) {
      ignoreFile.getPatterns('test/resources/specs/tiny', function (err, patterns) {
        expect(err).to.be.null;
        expect(patterns).to.deep.equal([
          "featurebook.json",
          "SUMMARY.md",
          ".featurebookignore",
          "assets",
          "dist",
          ".git",
          "*.cs"
        ]);
        done();
      });
    });

  });

  describe('#getPatternsSync', function () {

    it('should return default ignore path patterns', function () {
      var patterns = ignoreFile.getPatternsSync('test/resources/features');
      expect(patterns).to.deep.equal([
        "featurebook.json",
        "SUMMARY.md",
        ".featurebookignore",
        "assets",
        "dist",
        ".git"
      ]);
    });

    it('should return ignore path patterns', function () {
      var patterns = ignoreFile.getPatternsSync('test/resources/specs/tiny');
      expect(patterns).to.deep.equal([
        "featurebook.json",
        "SUMMARY.md",
        ".featurebookignore",
        "assets",
        "dist",
        ".git",
        "*.cs"
      ]);
    });

  });

});
