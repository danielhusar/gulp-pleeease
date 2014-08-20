'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var pleeease = require('./index.js');

it('It should process data', function (cb) {
  var stream = pleeease({
    optimizers: {
      minifier: false,
    },
  });
  stream.on('data', function (file) {
    assert.equal(file.contents.toString(), '@media all{body{color:red;}a{color:blue;}}');
    cb();
  });

  stream.write(new gutil.File({
    base: __dirname,
    path: __dirname + '/style.css',
    contents: new Buffer('@media all{body{color:red;}} @media all{a{color:blue;}}')
  }));

  stream.end();
});

it('It should generate source maps', function (cb) {
  var stream = pleeease({
    optimizers: {
      minifier: false,
    },
  });

  var init = sourcemaps.init();
  var write = sourcemaps.write();
  init.pipe(stream).pipe(write);

  stream.on('data', function (file) {
    assert(file.contents.toString().match('@media all{body{color:red;}a{color:blue;}}'));
    assert(file.contents.toString().match('sourceMappingURL=data:application/json;base64'));
    cb();
  });

  init.write(new gutil.File({
    base: __dirname,
    path: __dirname + '/style.css',
    sourceMap: '',
    contents: new Buffer('@media all{body{color:red;}} @media all{a{color:blue;}}')
  }));

  init.end();
});
