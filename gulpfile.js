const gulp = require("gulp");
const handlebars = require("gulp-compile-handlebars");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");

const templateData = {
  firstName: "Kaanon",
};

const hbs = () =>
  gulp
    .src("src/pages/*.hbs")
    .pipe(
      handlebars(templateData, {
        ignorePartials: true,
        batch: ["./src/components"],
      })
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());

const styles = () =>
  gulp
    .src("src/styles/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("dist/styles"))
    .pipe(browserSync.stream());

gulp.task("default", () => {
  browserSync.init({
    server: "./dist",
  });
  gulp.watch("src/styles/*.scss", styles);
  gulp.watch("src/**/*.hbs", hbs);
  gulp.watch("dist/*.html").on("change", browserSync.reload);
});
