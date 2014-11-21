var gulp = require('gulp')
var gutil = require('gulp-util')
var coffee = require('gulp-coffee')

gulp.task('coffee', function() {
  gulp.src('./*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./'))
})

gulp.task('watch', function(){
  gulp.watch('./*.coffee', ['coffee'])
})

gulp.task('default', ['coffee', 'watch'])
