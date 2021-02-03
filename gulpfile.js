'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemap = require('gulp-sourcemaps');
var scss = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var svgstore = require('gulp-svgstore');
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');
var del = require('del');

gulp.task('css', function () {
  return gulp.src('source/scss/style.scss')
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(scss())
      .pipe(postcss([autoprefixer()]))
      .pipe(gulp.dest('build/css'))
      .pipe(csso())
      .pipe(rename('style.min.css'))
      .pipe(sourcemap.write('.'))
      .pipe(gulp.dest('build/css'))
      .pipe(server.stream());
});

gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/scss/**/*.{scss,sass}', gulp.series('css'));
  gulp.watch('source/images/svg/icon-*.svg', gulp.series('sprite', 'html', 'refresh'));
  gulp.watch('source/*.html', gulp.series('html', 'refresh'));
  gulp.watch('source/js/*.js', gulp.series('js', 'refresh'));
});

gulp.task('refresh', function (done) {
  server.reload();
  done();
});

gulp.task('images', function () {
  return gulp.src('source/images/**/*.{png,jpg,svg}')
      .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.jpegtran({progressive: true}),
        imagemin.svgo()
      ]))

      .pipe(gulp.dest('build/images'));

});

gulp.task('webp', function () {
  return gulp.src('source/images/**/*.{png,jpg}')
      .pipe(webp({quality: 70}))
      .pipe(gulp.dest('build/images'));
});

gulp.task('sprite', function () {
  return gulp.src('source/images/icon-*.svg')
      .pipe(svgstore({inlineSvg: true}))
      .pipe(rename('sprite.svg'))
      .pipe(gulp.dest('build/images'));
});

gulp.task('html', function () {
  return gulp.src('source/*.html')
      .pipe(posthtml([
        include()
      ]))
      .pipe(gulp.dest('build'));
});

gulp.task('js', async function () {
  gulp.src("source/js/**/*.js")
    .pipe(gulp.dest("build/js"))
    .pipe(server.stream());
});

gulp.task('copy', function () {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source/images/**',
    'source/js/**',
    'source/*.ico'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
});


gulp.task('clean', function () {
  return del('build');
});

gulp.task('build', gulp.series('clean', 'copy', 'css', 'images', 'sprite', 'webp', 'html'));
gulp.task('start', gulp.series('build', 'server'));
