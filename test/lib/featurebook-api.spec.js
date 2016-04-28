'use strict';

var chai = require('chai');
var expect = chai.expect;

var featurebook = require('./../../lib/featurebook-api');

describe('featurebook-api', function () {

  it('should have version property', function () {
    expect(featurebook.version).to.equal(require('./../../package.json').version);
  });

});
