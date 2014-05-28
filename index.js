'use strict';
var gutil = require('gulp-util');
var through = require('through2');
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
      file.contents = new Buffer(pleeease.process(file.contents.toString(), opts));
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-pleeease', err));
    }

    this.push(file);
    cb();
  });
};
