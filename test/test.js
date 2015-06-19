'use strict';

var path = require('path');

var gulp       = require('gulp');
var assert     = require('stream-assert');
var concat     = require('gulp-concat');
var should     = require('should');
var sourcemaps = require('gulp-sourcemaps');

var pleeease = require('../index.js');

var fixtures = function (filename) {
  var join = function (p) {
    return path.join('./test/fixtures/', p);
  };
  if (Array.isArray(filename)) {
    filename.map(join);
  }
  return join(filename);
};

describe('gulp-pleeease', function () {

  describe('process', function () {

    it('one file without options', function (done) {
      gulp.src(fixtures('simple.css'))
        .pipe(pleeease())
        .pipe(assert.length(1))
        .pipe(assert.first(function (d) {
          d.relative.should.eql('simple.css');
        }))
        .pipe(assert.end(done));
    });

    it('one file with options', function (done) {
      gulp.src(fixtures('simple.css'))
        .pipe(pleeease({
          out: 'out.css'
        }))
        .pipe(assert.length(1))
        .pipe(assert.first(function (d) {
          d.relative.should.eql('out.css');
        }))
        .pipe(assert.end(done));
    });

    it('multiple file', function (done) {
      gulp.src(fixtures('*.css'))
        .pipe(concat('out.css', {newLine:''}))
        .pipe(pleeease())
        .pipe(assert.length(1))
        .pipe(assert.first(function (d) {
          d.relative.should.eql('out.css');
        }))
        .pipe(assert.end(done));
    });

  });

  describe('preprocess', function () {

    it('uses Sass with imports', function (done) {
      gulp.src(fixtures('pre.scss'))
        .pipe(pleeease({
          sass: {
            includePaths: ['test/fixtures']
          }
        }))
        .pipe(assert.length(1))
        .pipe(assert.first(function (d) {
          d.contents.toString().should.eql('.import{color:blue}.e{color:red}');
        }))
        .pipe(assert.end(done));
    });

    it('combines with postprocessors', function (done) {
      gulp.src(fixtures('post.scss'))
        .pipe(pleeease({
          browsers: ['last 99 versions'],
          sass: true,
        }))
        .pipe(assert.length(1))
        .pipe(assert.first(function (d) {
          d.contents.toString().should.eql('.e{color:red;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}');
        }))
        .pipe(assert.end(done));
    });

  });

  describe('sourcemaps', function () {

    var compareSourcemapJSON = function (json, map) {
      var mapJSON = JSON.parse(json);
      mapJSON.sources.should.eql(map.sources);
      mapJSON.mappings.should.eql(map.mappings);
      mapJSON.file.should.eql(map.file);
      mapJSON.sourcesContent.should.eql(map.sourcesContent);
    };
    var compareSourcemapInline = function (css, map) {
      var base64 = isSourcemapInline(css);
      (base64 !== null).should.be.ok;
      if (base64 !== null) {
        compareSourcemapJSON(new Buffer(base64[1], 'base64').toString(), map);
      }
    };
    var isSourcemapInline = function (css) {
      var re = /\/\*#\ssourceMappingURL=data:application\/json;base64,(.+)\s\*\//g;
      return re.exec(css);
    };

    var map = {
      sources: ['test/fixtures/simple.css', 'test/fixtures/simple2.css'],
      mappings: 'AAAA,QACA,SAAA,CCDA,SACA,WAAA,CACA',
      file: 'out.css',
      sourcesContent: ['.simple {\n  color: red;\n}','.simple2 {\n  color: green;\n}']
    };

    describe('gulp-sourcemaps', function () {

      it('creates inline with one file', function (done) {
        var _map = {
          sources: ['simple.css'],
          mappings: 'AAAA,QACE,SAAW,CACZ',
          file: 'test/fixtures/simple.css',
          sourcesContent: ['.simple {\n  color: red;\n}']
        };
        gulp.src(fixtures('simple.css'), {base: '.'})
          .pipe(sourcemaps.init())
            .pipe(pleeease())
          .pipe(sourcemaps.write())
          .pipe(assert.length(1))
          .pipe(assert.first(function (d) {
            var css = d.contents.toString();
            css.match(/sourceMappingURL=/g).length.should.eql(1);
            compareSourcemapInline(css, _map);
          }))
          .pipe(assert.end(done));
      });

      it('creates relatives sourcemaps', function (done) {
        var _map = {
          sources: ['../test/fixtures/simple.css'],
          mappings: 'AAAA,QACE,SAAW,CACZ',
          file: 'dest/out.css',
          sourcesContent: ['.simple {\n  color: red;\n}']
        };
        gulp.src(fixtures('simple.css'), {base: '.'})
          .pipe(sourcemaps.init())
            .pipe(pleeease({
              out: 'dest/out.css'
            }))
          .pipe(sourcemaps.write())
          .pipe(assert.length(1))
          .pipe(assert.first(function (d) {
            var css = d.contents.toString();
            css.match(/sourceMappingURL=/g).length.should.eql(1);
            compareSourcemapInline(css, _map);
          }))
          .pipe(assert.end(done));
      });

      it('creates inline with multiple files', function (done) {
        gulp.src(fixtures('*.css'), {base: '.'})
          .pipe(sourcemaps.init())
            .pipe(concat('out.css', {newLine: ''}))
            .pipe(pleeease())
          .pipe(sourcemaps.write())
          .pipe(assert.length(1))
          .pipe(assert.first(function (d) {
            var css = d.contents.toString();
            css.match(/sourceMappingURL=/g).length.should.eql(1);
            compareSourcemapInline(css, map);
          }))
          .pipe(assert.end(done));
      });

      it('creates separate with multiple files', function (done) {
        gulp.src(fixtures('*.css'), {base: '.'})
          .pipe(sourcemaps.init())
            .pipe(concat('out.css', {newLine: ''}))
            .pipe(pleeease())
          .pipe(sourcemaps.write('./'))
          .pipe(assert.length(2))
          .pipe(assert.first(function (d) {
            // sourcemaps
            var sourcemap = d.contents.toString();
            compareSourcemapJSON(sourcemap, map);
          }))
          .pipe(assert.second(function (d) {
            // file
            var css = d.contents.toString();
            css.should.endWith('\/*# sourceMappingURL=out.css.map *\/');
          }))
          .pipe(assert.end(done));
      });

    });

    describe('gulp-sourcemaps with preprocessors', function () {

      var map = {
        sources: ['test/fixtures/_import.scss', 'test/fixtures/pre.scss'],
        mappings: 'AAAA,QACE,UAAA,CAAA,ACCF,GADQ,SAAA,CAAA',
        file: 'out.css',
        sourcesContent: ['.import {\n  color: blue;\n}','@import \'_import.scss\';\n$color: red;\n.e {\n  color: $color;\n}']
      };

      it('creates inline', function (done) {
        gulp.src(fixtures('pre.scss'), {base: '.'})
          .pipe(sourcemaps.init())
            .pipe(pleeease({
              out: 'out.css',
              sass: {
                includePaths: ['test/fixtures']
              }
            }))
          .pipe(sourcemaps.write())
          .pipe(assert.length(1))
          .pipe(assert.first(function (d) {
            var css = d.contents.toString();
            css.match(/sourceMappingURL=/g).length.should.eql(1);
            compareSourcemapInline(css, map);
          }))
          .pipe(assert.end(done));
      });

      it('creates separate', function (done) {
        gulp.src(fixtures('pre.scss'), {base: '.'})
          .pipe(sourcemaps.init())
            .pipe(pleeease({
              out: 'out.css',
              sass: {
                includePaths: ['test/fixtures']
              }
            }))
          .pipe(sourcemaps.write('.'))
          .pipe(assert.length(2))
          .pipe(assert.first(function (d) {
            // sourcemaps
            var sourcemap = d.contents.toString();
            compareSourcemapJSON(sourcemap, map);
          }))
          .pipe(assert.second(function (d) {
            // file
            var css = d.contents.toString();
            css.should.endWith('\/*# sourceMappingURL=out.css.map *\/');
          }))
          .pipe(assert.end(done));
      });

    });

  });

});