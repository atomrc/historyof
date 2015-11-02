/*eslint-env node */
"use strict";

var production = (process.env.NODE_ENV === "production");

var gulp = require("gulp"),
    browserify = require("browserify"),
    jade = require("gulp-jade"),
    babelify = require("babelify"),
    sass = require("gulp-sass"),
    source = require("vinyl-source-stream");

var libs = [
    "react",
    "react-router",
    "react-dom",
    "history/lib/createBrowserHistory",
    "react-addons-pure-render-mixin",
    "flux",
    "flux/utils",
    "moment",
    "pikaday",
    "object-assign",
    "whatwg-fetch",
    "debounce",
    "bcryptjs",
    "uuid"
];

gulp.task("js-vendor", function() {
    var b = browserify({
        debug: false//!production
    });

    libs.forEach(function (id) {
        b.require(id, { expose: id });
    });

    return b
        .bundle()
        .pipe(source("vendor.js"))
        .pipe(gulp.dest("./public/js/"));
});

gulp.task("js-app", function() {

    var b = browserify("src/js/application.js", {
        debug: false,//!production,
        transform: [babelify.configure({
            presets: ["es2015", "react"]
        })]
    });

    libs.forEach(function (id) {
        b.external(id);
    });

    return b
        .bundle()
        .pipe(source("application.js"))
        .pipe(gulp.dest("./public/js/"));
});

gulp.task("jade", function () {
    return gulp
        .src("./src/*.jade")
        .pipe(jade())
        .pipe(gulp.dest("./public"));
});

gulp.task("sass", function () {
    return gulp
        .src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./public/css"));
});

gulp.task("watch", function () {
    gulp.watch("src/js/**/*.js", ["js-app"]);
    gulp.watch("src/scss/*.scss", ["sass"]);
    gulp.watch("src/*.jade", ["jade"]);
});

gulp.task("default", ["js-vendor", "js-app", "jade", "sass"]);
gulp.task("js", ["js-vendor", "js-app"]);
