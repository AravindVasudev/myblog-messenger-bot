const gulp         = require('gulp');
const imagemin     = require('gulp-imagemin');

gulp.task('default', () => {
  gulp.src('public/img/*')
      .pipe(imagemin())
      .pipe(gulp.dest('public/img/'));
});
