# [gulp](http://gulpjs.com)-pleeease [![Build Status](https://secure.travis-ci.org/danielhusar/gulp-pleeease.svg?branch=master)](http://travis-ci.org/danielhusar/gulp-pleeease) ![dependencies](https://david-dm.org/danielhusar/gulp-pleeease.png)

Gulp plugin for [pleeease](https://github.com/iamvdo/pleeease/)

See [pleeease](https://github.com/iamvdo/pleeease/) for documentation.

## Install

```bash
npm install --save-dev gulp-pleeease
```

## Example

```javascript
var gulp = require('gulp');
var please = require('gulp-please');

gulp.task('css', function () {
  gulp.src('./public/*.css')
  .pipe(please(options))
  .pipe(rename({
    suffix: '.min',
    extname: '.css'
  }))
  .pipe(gulp.dest('./public/'));
});

```

## Options

same as [pleeease](https://github.com/iamvdo/pleeease/#options)


## License

MIT © [Daniel Husar](https://github.com/danielhusar)
