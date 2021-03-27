const gulp = require("gulp");
const handlebars = require("gulp-compile-handlebars");
const image = require("gulp-image");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const fs = require("fs");

const hbs = () =>
  gulp
    .src("src/pages/**/*.hbs")
    .pipe(
      handlebars(JSON.parse(fs.readFileSync("src/data.json")), {
        ignorePartials: true,
        batch: ["./src/components"],
        helpers: {
          ifEquals: function (arg1, arg2, options) {
            return arg1 == arg2 ? options.fn(this) : options.inverse(this);
          },
        },
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

const scripts = () =>
  gulp
    .src("src/**/*.js")
    .pipe(
      rename((path) => {
        path.dirname = path.dirname.replace("pages/", "").replace("pages", "");
      })
    )
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());

const images = () =>
  gulp
    .src("./src/images/**/*.*")
    .pipe(image())
    .pipe(gulp.dest("./dist/images"));

gulp.task("default", () => {
  browserSync.init({
    server: "./dist",
  });
  styles();
  scripts();
  hbs();
  images();
  gulp.watch("src/**/*.scss", styles);
  gulp.watch("src/**/*.js", scripts);
  gulp.watch(["src/**/*.hbs", "src/data.json"], hbs);
  gulp.watch("src/images/**/*.*", images);
  gulp.watch("dist/*.html").on("change", browserSync.reload);
});

gulp.task("build", (done) => {
  styles();
  scripts();
  hbs();
  images();
  done();
});
