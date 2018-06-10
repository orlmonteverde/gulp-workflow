const gulp = require('gulp');
const sass = require('gulp-sass');
const cssmin = require('gulp-cssnano');
const htmlmin = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

// Configuration
const sassOptions = { outputStyle: 'expanded' };

const prefixerOptions = {
  browsers: ['last 3 versions'],
  cascade: false,
};

const babelOptions = {
  presets: [
    ['env', {
      targets: {
        browsers: ['last 2 versions', 'safari >= 7'],
      },
    }],
  ],
};

const htmlConfig = { collapseWhitespace: true };

// Tasks
gulp.task('img', () => {
  gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('html', () => {
  gulp.src('src/*.html')
    .pipe(htmlmin(htmlConfig))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', () => {
  gulp.src('src/scss/styles.scss')
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(prefixerOptions))
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('scripts', () => {
  gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel(babelOptions))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});

// Task to dev
gulp.task('serve', ['styles', 'scripts', 'html'], () => {
  browserSync.init({
    server: './dist',
  });

  gulp.watch('src/js/*.js', ['scripts']).on('change', browserSync.reload);
  gulp.watch('src/scss/**/*.scss', ['styles']);
  gulp.watch('src/*.html', ['html']).on('change', browserSync.reload);
  gulp.watch('src/img/*', ['img']).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);


// Task to production
gulp.task('build', ['styles', 'scripts', 'img', 'html']);
