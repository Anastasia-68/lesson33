const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer').default; // <- исправлено
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

// Пути
const paths = {
  scss: {
    src: 'src/scss/style.scss',
    watch: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  html: {
    src: 'src/*.html'
  }
};

// SCSS → CSS
function styles() {
  return gulp.src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false })) // теперь работает
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

// Сервер + live reload
function serve() {
  browserSync.init({ server: { baseDir: 'src' } });
  gulp.watch(paths.scss.watch, styles);
  gulp.watch(paths.html.src).on('change', browserSync.reload);
}

// Экспорт задач
exports.styles = styles;
exports.serve = serve;
exports.default = gulp.series(styles, serve);
