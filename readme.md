# [gulp](http://gulpjs.com)-pleeease [![Build Status](https://secure.travis-ci.org/danielhusar/gulp-pleeease.svg?branch=master)](http://travis-ci.org/danielhusar/gulp-pleeease)

Gulp plugin for [pleeease](https://github.com/iamvdo/pleeease/)

See [pleeease.io](http://pleeease.io/docs) for documentation.

## Install

```bash
npm install --save-dev gulp-pleeease
```

## Example

```javascript
var gulp     = require('gulp');
var pleeease = require('gulp-pleeease');

gulp.task('css', function () {
  gulp.src('./src/*.css')
  .pipe(pleeease())
  .pipe(rename({
    suffix: '.min',
    extname: '.css'
  }))
  .pipe(gulp.dest('./dest'));
});
```

You can also use `out` option (and it's preferable for good sourcemaps):

```javascript
gulp.task('css', function () {
  gulp.src('./src/*.css')
  .pipe(pleeease({
    out: 'out.min.css'
  }))
  .pipe(gulp.dest('./dest'));
});
```

## Preprocessors support

As simple as it looks, no need for specific gulp modules:

```javascript
var gulp     = require('gulp');
var pleeease = require('gulp-pleeease');

gulp.task('css', function () {
  gulp.src('./src/*.scss')
  .pipe(pleeease({
    sass: true
  }))
  .pipe(gulp.dest('./dest'));
});
```

Or maybe, if you have imports:

```javascript
var gulp     = require('gulp');
var pleeease = require('gulp-pleeease');

gulp.task('css', function () {
  gulp.src('./src/*.scss')
  .pipe(pleeease({
    sass: {
      includePaths: ['path/to/include']
    }
  }))
  .pipe(gulp.dest('./dest'));
});
```

You can use Sass, LESS or Stylus.

## Source map support

Using gulp-sourcemaps. To get good sourcemaps, you should always specify `base` option in `gulp.src`. You will get inline sourcemaps.

```javascript
var gulp       = require('gulp');
var pleeease   = require('gulp-pleeease');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('css', function () {
  gulp.src('./src/*.css', {base: '.'})
    .pipe(sourcemaps.init())
      .pipe(pleeease())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dest'));
});
```

And even with preprocessors. Here, using Stylus, and with sourcemaps as a separate file:

```javascript
var gulp       = require('gulp');
var pleeease   = require('gulp-pleeease');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('css', function () {
  gulp.src('./src/*.styl', {base: '.'})
    .pipe(sourcemaps.init())
      .pipe(pleeease({
        stylus: {
          paths: ['path/to/include']
        }
      }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dest'));
});
```

## Options

Same as [pleeease](http://pleeease.io/docs)


## License

MIT © [Daniel Husar](https://github.com/danielhusar)
