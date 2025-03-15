/* global require */

var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var plumber = require('gulp-plumber');
var merge = require('merge-stream'); // Import merge-stream

var globs = {
    dist: "./dist",
    js: [
        "./res/js/jquery-1.7.min.js",
        "./res/js/TheShodo.js",
        "./res/js/TheShodo.FloatingPanel.js",
        "./res/js/TheShodo.Shodo.Core.js",
        "./res/js/TheShodo.Shodo.Player.js",
        "./res/js/TheShodo.Shodo.Resources.js",
        "./res/js/TheShodo.Shodo.Write.js",
        "./res/js/kazari.js",
        "./res/js/floatingPanels.js"
    ],
    css: [
        "./res/css/base.css",
        "./res/css/index.css",
    ],
    images: "./res/img/*",
    media: "./res/media/*"
};

// Clean task
gulp.task('clean', function () {
    return gulp.src([globs.dist], { read: false, allowEmpty: true })
        .pipe(clean());
});

// Assets task
gulp.task('assets', function () {
    var images = gulp.src(globs.images)
        .on('data', function (file) {
            console.log('Processing image:', file.path);
        })
        .pipe(plumber(function (err) {
            console.error('Images error:', err.toString());
            this.emit('end'); // Prevent the task from hanging
        }))
        .pipe(gulp.dest(globs.dist + '/res/img'));

    var media = gulp.src(globs.media)
        .on('data', function (file) {
            console.log('Processing media:', file.path);
        })
        .pipe(plumber(function (err) {
            console.error('Media error:', err.toString());
            this.emit('end'); // Prevent the task from hanging
        }))
        .pipe(gulp.dest(globs.dist + '/res/media'));

    var html = gulp.src('./index.html')
        .on('data', function (file) {
            console.log('Processing HTML:', file.path);
        })
        .pipe(plumber(function (err) {
            console.error('HTML error:', err.toString());
            this.emit('end'); // Prevent the task from hanging
        }))
        .pipe(gulp.dest(globs.dist));

    // Use merge-stream to combine streams
    return merge(images, media, html);
});

// Styles task
gulp.task('styles', function () {
    return gulp.src(globs.css)
        .pipe(plumber(function (err) {
            console.error('CSS error:', err.toString());
            this.emit('end'); // Prevent the task from hanging
        }))
        .pipe(concat('bundle.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(globs.dist + '/res/css'));
});

// Scripts task
gulp.task('scripts', function () {
    return gulp.src(globs.js)
        .pipe(plumber(function (err) {
            console.error('JS error:', err.toString());
            this.emit('end'); // Prevent the task from hanging
        }))
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest(globs.dist + '/res/js'));
});

// Build task
gulp.task('build', gulp.series('clean', gulp.parallel('scripts', 'styles', 'assets')));

// Default task
gulp.task('default', gulp.series('build'));;