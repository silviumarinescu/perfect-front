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
    .src("src/pages/**/*.hbs")
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
    .src("src/**/*.scss")
    .pipe(sass())
    .pipe(
      rename((path) => {
        path.dirname = path.dirname.replace("pages/", "").replace("pages", "");
      })
    )
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());

gulp.task("default", () => {
  browserSync.init({
    server: "./dist",
  });
  gulp.watch("src/**/*.scss", styles);
  gulp.watch("src/**/*.hbs", hbs);
  gulp.watch("dist/*.html").on("change", browserSync.reload);
});
