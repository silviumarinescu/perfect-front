const gulp = require("gulp");
const handlebars = require("gulp-compile-handlebars");
const image = require("gulp-image");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const fs = require("fs");

const hbs = () =>
  gulp
    .src("src/pages/**/*.hbs")
    .pipe(
      handlebars(JSON.parse(fs.readFileSync("src/data.json")), {
        ignorePartials: true,
        batch: ["./src/components"],
        helpers: {
          ifHelper: function (v1, operator, v2, options) {
            switch (operator) {
              case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);
              case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);
              case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);
              case "!==":
                return v1 !== v2 ? options.fn(this) : options.inverse(this);
              case "<":
                return v1 < v2 ? options.fn(this) : options.inverse(this);
              case "<=":
                return v1 <= v2 ? options.fn(this) : options.inverse(this);
              case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);
              case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);
              case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);
              case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);
              default:
                return options.inverse(this);
            }
          },
        },
      })
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("www"))
    .pipe(browserSync.stream());

const styles = () =>
  gulp
    .src("src/**/*.scss")
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: "Error",
            subtitle: "Failure!",
            message: "Error: <%= error.message %>",
            sound: "Beep",
          })(err);

          browserSync.notify(
            `Error: <span style='color:red'>${err.message}</span>`,
            5000
          );

          this.emit("end");
        },
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write("."))
    .pipe(
      rename((path) => {
        path.dirname = path.dirname.replace("pages/", "").replace("pages", "");
      })
    )
    .pipe(gulp.dest("www"))
    .pipe(browserSync.stream());

const scripts = () =>
  gulp
    .src("src/**/*.js")
    .pipe(
      rename((path) => {
        path.dirname = path.dirname.replace("pages/", "").replace("pages", "");
      })
    )
    .pipe(gulp.dest("www"))
    .pipe(browserSync.stream());

const images = () =>
  gulp.src("./src/images/**/*.*").pipe(image()).pipe(gulp.dest("./www/images"));

gulp.task("default", () => {
  browserSync.init({
    server: {
      baseDir: "./www",
    },
    open: true,
    startPath: "",
    tunnel: false,
  });
  styles();
  scripts();
  hbs();
  images();
  gulp.watch("src/**/*.scss", styles);
  gulp.watch("src/**/*.js", scripts);
  gulp.watch(["src/**/*.hbs", "src/data.json"], hbs);
  gulp.watch("src/images/**/*.*", images);
  gulp.watch("www/**/**.**").on("change", browserSync.reload);
});

gulp.task("build", (done) => {
  styles();
  scripts();
  hbs();
  images();
  done();
});
