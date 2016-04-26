'use strict';

var chai = require('chai');
var expect = chai.expect;

var featurebook = require('./../../lib/featurebook-api');

describe('featurebook-api', function () {

  it('should work!', function () {
    expect(featurebook).to.not.be.undefined;
  });

});
