'use strict';

/**
 * Local run: gulp
 * Production run: gulp production
 * Pass --minify to minify
 */

var gulp = require('gulp');
var bower = require('gulp-bower');
var imagemin = require('gulp-imagemin');
var del = require('del');
var less = require('gulp-less');
var watch = require('gulp-watch');
var babelify = require("babelify");
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var minifyCss = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var argv = require('yargs').argv;
var server = require('gulp-develop-server');
var browserSync = require('browser-sync').create();
var path = require('path');
var runSequence = require('run-sequence');
var config = require('./config/config');
var env = process.env.NODE_ENV;

// Paths
var PATHS = {};
PATHS.ROOT = '.';
PATHS.SERVER_CONFIG_DIR = path.join(PATHS.ROOT, 'config/');
PATHS.SERVER_APP_DIR = path.join(PATHS.ROOT, 'app/');
PATHS.PUBLIC_DIR = path.join(PATHS.ROOT, 'public/');
PATHS.VIEW_DIR = path.join(PATHS.ROOT, 'views/');
PATHS.ASSET_SRC = path.join(PATHS.ROOT, 'assets/');
PATHS.ASSET_DST = path.join(PATHS.PUBLIC_DIR, "assets/");
PATHS.IMG_SRC = path.join(PATHS.ASSET_SRC, 'img/');
PATHS.IMG_DST = path.join(PATHS.ASSET_DST, 'img/');
PATHS.CSS_SRC = path.join(PATHS.ASSET_SRC, 'less/');
PATHS.CSS_DST = path.join(PATHS.ASSET_DST, 'css/');
PATHS.JS_SRC = path.join(PATHS.ASSET_SRC, 'js/');
PATHS.JS_DST = path.join(PATHS.ASSET_DST, 'js/');
PATHS.APP_SRC = path.join(PATHS.ROOT, 'components/');
PATHS.APP_DST = path.join(PATHS.ASSET_DST, 'js/');


// Main entry points
var ENTRY = {};
ENTRY.APP_SRC = 'app.jsx';
ENTRY.APP_DST = 'app.js';
ENTRY.JS_DST = 'main.js';
ENTRY.CSS_DST = 'style.css';

// Flags
var doMinify = argv.minify;

// Tasks
var tasks = {};
tasks.react = function () {
    browserSync.notify("Compiling JSX, please wait...");

    var stream = browserify(PATHS.APP_SRC + ENTRY.APP_SRC)
        .transform(reactify)
        .transform(babelify, {presets: ["es2015", "react"]})
        .transform(babelify)
        .bundle()
        .pipe(source(ENTRY.APP_DST));

    // Minify JS file
    if (doMinify) {
        stream = stream.pipe(buffer()).pipe(uglify());
    }

    return stream
        .pipe(gulp.dest(PATHS.APP_DST));
};

tasks.less = function () {
    browserSync.notify("Compiling LESS, please wait...");

    var stream = gulp
        .src(PATHS.CSS_SRC + "**/*.less")
        .pipe(concat(ENTRY.CSS_DST))
        .pipe(less());

    // Minify CSS file
    if (doMinify) {
        stream = stream.pipe(minifyCss());
    }

    return stream
        .pipe(gulp.dest(PATHS.CSS_DST))
        .pipe(browserSync.stream());
};

tasks.js = function () {
    browserSync.notify("Compiling JS, please wait...");

    var stream = gulp
        .src(PATHS.JS_SRC + "**/*.js")
        .pipe(concat(ENTRY.JS_DST));

    if (doMinify) {
        stream = stream.pipe(uglify());
    }

    return stream
        .pipe(gulp.dest(PATHS.JS_DST));
};

tasks.image = function () {
    var stream = gulp
        .src(PATHS.IMG_SRC + "**/*")
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest(PATHS.IMG_DST));

    return stream;
};

tasks.bower = function () {
    return bower();
};

tasks.server = function () {
    if (env !== 'local') {
        return envNotLocal();
    }

    return server.listen({
        env: {NODE_ENV: 'local'},
        path: './app.js'
    });
};

tasks.serverRestart = function(done) {
    return server.restart(done);
};

tasks.browserReload = function() {
    browserSync.reload();
};

tasks.browser = function (done) {
    if (env !== 'local') {
        return envNotLocal();
    }

    var proxy = 'http://localhost:' + config.http_port;
    browserSync.init({
        proxy: proxy,
        browser: "google chrome"
    });
    done();
};

tasks.watch = function () {
    if (env !== 'local') {
        return envNotLocal();
    }

    runSequence('server', 'browser', function () {
        gulp.watch(PATHS.VIEW_DIR + "**/*.jade", ["react:watch"]);
        gulp.watch(PATHS.JS_SRC + "**/*.js", ["js:watch"]);
        gulp.watch(PATHS.APP_SRC + "**/*.js", ["react:watch"]);
        gulp.watch(PATHS.APP_SRC + "**/*.jsx", ["react:watch"]);
        gulp.watch(PATHS.CSS_SRC + "**/*.less", ["less:watch"]);
        gulp.watch(PATHS.IMG_SRC + "**/*", ["image:watch"]);
        gulp.watch(PATHS.SERVER_APP_DIR + "**/*", ['server:watch']);
        gulp.watch(PATHS.SERVER_CONFIG_DIR + "**/*", ['server:watch']);
    });
};

tasks.build = function (done) {
    runSequence('react:clean', 'less:clean', 'js:clean', 'image:clean', done);
};

tasks.reactClean = function () {
    return del([PATHS.APP_DST + ENTRY.APP_DST]);
};

tasks.cssClean = function () {
    return del([PATHS.CSS_DST + ENTRY.CSS_DST]);
};

tasks.jsClean = function () {
    return del([PATHS.JS_DST + ENTRY.JS_DST]);
};

tasks.imgClean = function () {
    return del([PATHS.IMG_DST]);
};

function envNotLocal() {
    var msg = 'You are trying to run a local environmental setting on a live server';
    var err = new Error(msg);
    console.error(err);
    return err;
}

gulp.task('react:watch', ['react:clean'], tasks.browserReload);
gulp.task('react:clean', ['reactClean'], tasks.react);
gulp.task('react', tasks.react);
gulp.task('reactClean', tasks.reactClean);

gulp.task('less:watch', ['less:clean'], tasks.browserReload);
gulp.task('less:clean', ['cssClean'], tasks.less);
gulp.task('less', tasks.less);
gulp.task('cssClean', tasks.cssClean);

gulp.task('js:watch', ['js:clean'], tasks.browserReload);
gulp.task('js:clean', ['jsClean'], tasks.js);
gulp.task('js', tasks.js);
gulp.task('jsClean', tasks.jsClean);

gulp.task('image:watch', ['image:clean'], tasks.browserReload);
gulp.task('image:clean', ['imageClean'], tasks.image);
gulp.task('image', tasks.image);
gulp.task('imageClean', tasks.imgClean);

gulp.task('server:watch', ['server:restart'], tasks.browserReload);
gulp.task('server:restart', tasks.serverRestart);
gulp.task('server', tasks.server);

gulp.task('browser', tasks.browser);
gulp.task('bower', tasks.bower);

// Entry point gulp tasks
gulp.task('build', ['bower'], tasks.build);
gulp.task('default', ['build'], tasks.watch);
gulp.task('production', ['build']);
