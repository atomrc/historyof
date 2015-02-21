/*eslint-env node */
"use strict";

var gulp = require("gulp"),
    browserify = require("gulp-browserify"),
    uglify = require("gulp-uglify"),
    jade = require("gulp-jade"),
    react = require("gulp-react");

gulp.task("js", function() {
    gulp
        .src("./src/js/application.js")
        .pipe(react())
        .pipe(browserify())
        //.pipe(uglify())
        .pipe(gulp.dest("./public/js"));
});

gulp.task("jade", function () {
    gulp
        .src("./src/index.jade")
        .pipe(jade())
        .pipe(gulp.dest("./public"));
});

gulp.task("watch", function () {
    gulp.watch("src/js/*.js", ["js"]);
    gulp.watch("src/index.jade", ["jade"]);
});
