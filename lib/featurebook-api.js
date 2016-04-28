'use strict';

module.exports = {
  getVersion: getVersion
};

function getVersion() {
  return require('./../package.json').version;
}
