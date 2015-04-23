/*eslint-env node */
"use strict";

var gulp = require("gulp"),
    browserify = require("gulp-browserify"),
    uglify = require("gulp-uglify"),
    jade = require("gulp-jade"),
    babelify = require("babelify"),
    sass = require("gulp-sass");

gulp.task("js", function() {
    gulp
        .src("./src/js/application.js")
        .pipe(browserify({
            transform: [babelify]
        }))
        //.pipe(uglify())
        .pipe(gulp.dest("./public/js"));
});

gulp.task("jade", function () {
    gulp
        .src("./src/index.jade")
        .pipe(jade())
        .pipe(gulp.dest("./public"));
});

gulp.task("sass", function () {
    gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./public/css"));
});

gulp.task("watch", function () {
    gulp.watch("src/js/**/*.js", ["js"]);
    gulp.watch("src/scss/*.scss", ["sass"]);
    gulp.watch("src/index.jade", ["jade"]);
});

gulp.task("default", ["js", "jade", "sass"]);
