'use strict';

var walker = require('../../lib/dir-walker');
var path = require('path');
var minimatch = require('minimatch');

var chai = require('chai');
var expect = chai.expect;

describe('dir-walker', function () {

  var TEST_DIR = 'test/resources/dir-walker';
  var ALL_FILES_EXCEPT_C_SHARP_FILTER = function (dir, file) {
    return !minimatch(path.join(dir, file), '**/*.cs');
  };

  describe('#findTreeSync', function () {
    it('should return files tree object', function () {
      var tree = walker.findTreeSync(TEST_DIR, ALL_FILES_EXCEPT_C_SHARP_FILTER);
      expectTree(tree);
    });
  });

  describe('#findTree', function () {
    it('should propagate files tree object', function (done) {
      walker.findTree(TEST_DIR, ALL_FILES_EXCEPT_C_SHARP_FILTER, function (err, tree) {
        expect(err).to.be.null;
        expectTree(tree);
        done();
      });
    });
  });

  function expectTree(tree) {
    expect(tree).to.deep.equal({
      "path": ".",
      "name": "dir-walker",
      "type": "directory",
      "children": [
        {
          "path": "dir-a",
          "name": "dir-a",
          "type": "directory",
          "children": [
            {
              "path": "dir-a/dir-b",
              "name": "dir-b",
              "type": "directory",
              "children": [
                {
                  "path": "dir-a/dir-b/dir-c",
                  "name": "dir-c",
                  "type": "directory",
                  "children": [
                    {
                      "path": "dir-a/dir-b/dir-c/file-e.feature",
                      "name": "file-e.feature",
                      "type": "file"
                    }
                  ]
                },
                {
                  "path": "dir-a/dir-b/file-c.feature",
                  "name": "file-c.feature",
                  "type": "file"
                },
                {
                  "path": "dir-a/dir-b/file-d.txt",
                  "name": "file-d.txt",
                  "type": "file"
                }
              ]
            },
            {
              "path": "dir-a/file-a.feature",
              "name": "file-a.feature",
              "type": "file"
            },
            {
              "path": "dir-a/file-b.txt",
              "name": "file-b.txt",
              "type": "file"
            }
          ]
        }
      ]
    });
  }

});
