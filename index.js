'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var pleeease = require('pleeease');
var applySourceMap = require('vinyl-sourcemaps-apply');

module.exports = function (opts) {
  opts = opts ? opts : {};

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-pleeease', 'Streaming not supported'));
      return;
    }

    try {
      if (file.sourceMap) {
        opts.sourcemaps = {
          from : file.relative || file.path,
          map : {
            annotation: false
          }
        };
      }

      var result = pleeease.process(file.contents.toString(), opts);
      file.contents = new Buffer(result.css || result);
      if (file.sourceMap && result.map) {
        applySourceMap(file, result.map.toString());
      }

      cb(null, file);

    } catch (err) {
      cb(new gutil.PluginError('gulp-pleeease', err, {fileName: file.path}));
      this.emit('error', new gutil.PluginError('gulp-pleeease', err));
    }

  });
};
