const gulp = require("gulp");
const hb = require("gulp-hb");
const image = require("gulp-image");
const rename = require("gulp-rename");
const open = require("open");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");

const hbs = () =>
  gulp
    .src("src/pages/**/*.hbs")
    .pipe(
      hb()
        .partials("./src/components/**/*.hbs")
        .helpers("./src/helpers/*.js")
        .data("./src/data/**/*.{js,json}")
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
    .src("src/scripts/**/*.js")
    .pipe(gulp.dest("www/scripts"))
    .pipe(browserSync.stream());

const images = () =>
  gulp.src("./src/images/**/*.*").pipe(image()).pipe(gulp.dest("./www/images"));

gulp.task("default", () => {
  let location = "web-dev-test-987";
  location = false;
  browserSync.init({
    server: {
      baseDir: "./www",
    },
    middleware: function (req, res, next) {
      res.setHeader("Bypass-Tunnel-Reminder", "yes");
      next();
    },
    open: false,
    startPath: "",
    tunnel: location,
  });
  styles();
  scripts();
  hbs();
  images();
  gulp.watch("src/**/*.scss", styles);
  gulp.watch("src/scripts/**/*.js", scripts);
  gulp.watch(
    [
      "src/**/*.hbs",
      "src/data/**/*.json",
      "src/data/**/*.js",
      "src/helpers/**/*.js",
    ],
    hbs
  );
  gulp.watch("src/images/**/*.*", images);
  gulp.watch("www/**/**.**").on("change", browserSync.reload);
  if (location)
    setTimeout(() => {
      open(`https://${location}.loca.lt`);
    }, 300);
  else {
    open(`http://localhost:3000`);
  }
});

gulp.task("build", (done) => {
  styles();
  scripts();
  hbs();
  images();
  done();
});
