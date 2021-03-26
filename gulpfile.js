const gulp = require("gulp");
const handlebars = require("gulp-compile-handlebars");
const image = require("gulp-image");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");

const hbs = () =>
  gulp
    .src("src/pages/**/*.hbs")
    .pipe(
      handlebars(require("./src/data.json"), {
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

const images = () =>
  gulp.src("./src/images/**/*.*").pipe(image()).pipe(gulp.dest("./dist/images"));

gulp.task("default", () => {
  browserSync.init({
    server: "./dist",
  });
  styles();
  hbs();
  images();
  gulp.watch("src/**/*.scss", styles);
  gulp.watch(["src/**/*.hbs", "src/data.json"], hbs);
  gulp.watch("src/images/**/*.*", images);
  gulp.watch("dist/*.html").on("change", browserSync.reload);
});
