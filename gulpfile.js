/*global require*/
var gulp = require("gulp"),
    browserify = require("gulp-browserify"),
    uglify = require("gulp-uglify"),
    react = require("gulp-react");

gulp.task("default", function() {
    "use strict";
    gulp
        .src("./src/js/application.js")
        .pipe(react())
        .pipe(browserify())
        //.pipe(uglify())
        .pipe(gulp.dest("./public/js"));
});

gulp.task("watch", function () {
    "use strict";
    return gulp.watch("src/js/*.js", ["default"]);
});
