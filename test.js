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
    assert.equal(file.contents.toString(), '@media all{body{color:red}a{color:blue}}');
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

  write.on('data', function (file) {
    assert.equal(file.sourceMap.mappings, 'AAAA,WAAW,KAAK,UAAU,AAAc,CAAb,CAAe,WAAW,CAAC,CAA1B');
    assert(file.contents.toString().match('@media all{body{color:red}a{color:blue}}'));
    assert(file.contents.toString().match('sourceMappingURL=data:application/json;base64'));
    assert(file.contents.toString().match('eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0eWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLEtBQUssVUFBVSxBQUFjLENBQWIsQ0FBZSxXQUFXLENBQUMsQ0FBMUIiLCJmaWxlIjoic3R5bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQG1lZGlhIGFsbHtib2R5e2NvbG9yOnJlZDt9fSBAbWVkaWEgYWxse2F7Y29sb3I6Ymx1ZTt9fSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ'));
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
