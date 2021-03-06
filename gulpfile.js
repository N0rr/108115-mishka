"use strict";

var gulp = require("gulp");
var del = require("del");
var rename = require("gulp-rename");
var plumber = require("gulp-plumber");
var less = require("gulp-less");
var minify = require("gulp-csso");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-imagemin");
var imagemin = require("gulp-imagemin");
var server = require("browser-sync");
var run = require("run-sequence");

gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    "symbols",
    fn
  );
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("copy", function() {
  return gulp.src ([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**",
    "*.html",
    "less/**"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"));
});

gulp.task("style", function() {
  gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 1 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions"
      ]}),
      mqpacker({
        sort: false
      })
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(gulp.dest("css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))    
    .pipe(server.reload({stream: true}));
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("symbols", function() {
  return gulp.src("build/img/icons/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("htmlCopy", function() {
  return gulp.src ([    
    "*.html"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"))
});

gulp.task("serve", function() {
  server.init({
    server: "."
  });   
  
  gulp.watch("*.html", ["htmlCopy"]).on("change", server.reload);
  gulp.watch("less/**/*.less", ["style"]); 
  gulp.watch("css/**/*.css").on("change", server.reload);    
});
