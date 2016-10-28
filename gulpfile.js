var gulp = require('gulp'),
    watch = require('gulp-watch')
    livereload = require('gulp-livereload');

gulp.task('stream', function () {
    livereload.listen();
    return watch(['*.html','js/*.js','js/**/*.js','css/*.css'], { ignoreInitial: false })
        .pipe(livereload());
});

gulp.task('copy-libs',function(){
  return gulp.src(['node_modules/two.js/build/two.min.js','node_modules/genetic-js/lib/genetic.js','node_modules/genetic-js/lib/dist.js','node_modules/underscore/underscore-min.js','node_modules/backbone/backbone-min.js'])
  .pipe(gulp.dest('js/lib/'));
})
