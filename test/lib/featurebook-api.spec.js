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

});
