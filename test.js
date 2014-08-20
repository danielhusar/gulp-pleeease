'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
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
