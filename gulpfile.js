const gulp = require("gulp");
const through = require("through2");
const image = require("gulp-image");
const rename = require("gulp-rename");
const open = require("open");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");

const ReactParser = require("./reactParser");
const reactParser = new ReactParser();

const jsx = () =>
  gulp
    .src("src/pages/**/*.jsx")
    .pipe(
      through.obj(async (file, enc, cb) => {
        const app = await reactParser.getCode(file.path.split("/src")[1], true);
        const ReactDOMServer = require("react-dom/server");
        const dom = ReactDOMServer.renderToString(app());
        file.contents = Buffer.from(`<!DOCTYPE html>${dom}`);
        cb(null, file);
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
    .src("src/scripts/**/*.js")
    .pipe(gulp.dest("www/scripts"))
    .pipe(browserSync.stream());

const images = () =>
  gulp.src("./src/images/**/*.*").pipe(image()).pipe(gulp.dest("./www/images"));

gulp.task("default", () => {
  let location = "web-dev-test-987";
  // location = false; // uncomment if tunnel is not working
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
  jsx();
  images();
  gulp.watch("src/**/*.scss", styles);
  gulp.watch("src/scripts/**/*.js", scripts);
  gulp.watch(["src/**/*.jsx", "src/data/**/*.js"], jsx);
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
  jsx();
  images();
  done();
});
