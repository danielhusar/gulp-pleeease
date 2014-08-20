'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var applySourceMap = require('vinyl-sourcemaps-apply');
var pleeease = require('pleeease');

module.exports = function (opts) {
  opts = opts ? opts : {};

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-pleeease', 'Streaming not supported'));
      return cb();
    }

    try {
      if (file.sourceMap) {
        opts.sourcemaps = {};

        if (file.base && file.path) {
          opts.sourcemaps.from = file.relative;
        } else {
          opts.sourcemaps.from = file.path;
        }
        opts.sourcemaps.map = { annotation: false };
      }

      var result = pleeease.process(file.contents.toString(), opts);
      file.contents = new Buffer(result.css || result);

      // apply source map to the chain
      if (file.sourceMap && result.map) {
        applySourceMap(file, result.map.toString());
      }

    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-pleeease', err));
    }

    this.push(file);
    cb();
  });
};
