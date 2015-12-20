/*eslint-env node */
"use strict";

var production = (process.env.NODE_ENV === "production");

var gulp = require("gulp"),
    jade = require("gulp-jade"),
    sass = require("gulp-sass"),
    webpack = require("webpack"),
    webpackConfig = require("./webpack.config.js");

var webpackCompiler = webpack(webpackConfig);

gulp.task("js", function (done) {
    webpackCompiler.run(function(err, stats) {
        if(err) throw new Error(err);
        console.log("[webpack:build-dev]", stats.toString({
            colors: true,
            chunks: false,
            timing: true
        }));
        done();
    });
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
    gulp.watch("src/js/**/*.js", ["js"]);
    gulp.watch("src/scss/*.scss", ["sass"]);
    gulp.watch("src/*.jade", ["jade"]);
});

gulp.task("default", ["jade", "sass", "js"]);
