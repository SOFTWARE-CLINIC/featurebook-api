'use strict';

var constants = require('./constants');
var fs = require('fs');
var path = require('path');

function findTree(startDir, filter, cb) {
  var root = {};
  var asyncOps = 0;
  var errored = false;

  function error(err) {
    if (!errored) {
      return cb(err);
    }
    errored = true;
  }

  function search(parent, file) {
    parent.path = path.normalize(path.relative(startDir, file)).replace(/\\/g, '/');
    parent.name = path.basename(file);
    parent.displayName = getDisplayName(parent.name);

    asyncOps++;
    fs.stat(file, function (err, stat) {
      if (err) {
        error(err);
      }

      if (stat.isDirectory()) {
        parent.type = constants.NODE_DIRECTORY;
        asyncOps++;
        ireaddir(file, filter, function (err, files) {
          if (err) error(err);

          parent.children = [];
          files.forEach(function (f) {
            var node = {};
            parent.children.push(node);
            search(node, path.join(file, f));
          });
          asyncOps--;
          if (asyncOps === 0) {
            return cb(null, root);
          }
        });
      }
      if (stat.isFile()) {
        parent.type = constants.NODE_FILE;
      }
      asyncOps--;
      if (asyncOps === 0) {
        return cb(null, root);
      }
    });
  }

  search(root, startDir);
}

function findTreeSync(startDir, filter) {

  function search(file) {
    var node = {
      path: path.normalize(path.relative(startDir, file)).replace(/\\/g, '/'),
      name: path.basename(file)
    };
    node.displayName = getDisplayName(node.name);

    var stats = fs.statSync(file);

    if (stats.isDirectory()) {
      node.type = constants.NODE_DIRECTORY;
      node.children = [];
      var files = ireaddirSync(file, filter);

      files.forEach(function (f) {
        node.children.push(search(path.join(file, f)));
      });
    }
    if (stats.isFile()) {
      node.type = constants.NODE_FILE;
    }

    return node;
  }

  return search(startDir);
}

function getDisplayName(fileName) {
  var withoutUnderscores = fileName.replace(/_/g, ' ');
  var uppercased = withoutUnderscores.charAt(0).toUpperCase() + withoutUnderscores.slice(1);
  return uppercased.replace(/\.feature/g, '');
}

function ireaddirSync(dir, filter) {
  return filterFiles(dir, fs.readdirSync(dir), filter);
}

function ireaddir(dir, filter, callback) {
  fs.readdir(dir, function (err, files) {
    if (err) {
      return callback(err);
    }
    callback(null, filterFiles(dir, files, filter));
  });
}

function filterFiles(dir, files, filter) {
  var filteredFiles = [];
  files.forEach(function (f) {
    if (filter(dir, f)) {
      filteredFiles.push(f);
    }
  });
  return filteredFiles;
}

module.exports = {
  findTree: findTree,
  findTreeSync: findTreeSync
};
