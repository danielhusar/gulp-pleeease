'use strict';

var path           = require('path');
var gutil          = require('gulp-util');
var through        = require('through2');
var pleeease       = require('pleeease');
var applySourceMap = require('vinyl-sourcemaps-apply');

var PLUGIN_NAME = 'gulp-pleeease';

module.exports = function (opts) {
  opts = opts ? opts : {};

  function bufferContents (file, enc, cb) {

    var outFile = opts.out || file.relative;
    if (file.isNull() || !file.contents.toString()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return;
    }

    try {
      if (file.sourceMap) {
        opts.sourcemaps = {
          map : {
            inline: false,
            annotation: false
          }
        };
      }
      if (opts.sourcemaps) {
        opts.sourcemaps.from = file.relative;
        opts.sourcemaps.to   = outFile;
      }

      pleeease.process(file.contents.toString(), opts).then(function (result) {
        file.contents = new Buffer(result.css || result);
        file.path = path.join(file.base, outFile);
        if (file.sourceMap && result.map) {
          applySourceMap(file, result.map.toString());
        }

        cb(null, file);
      }, error);

    } catch (err) {
      error(err);
    }

    function error (err) {
      cb(new gutil.PluginError(PLUGIN_NAME, err, {fileName: file.path}));
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
    }
  }

  return through.obj(bufferContents);

};
