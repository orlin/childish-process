var gulp = require('beverage')(require('gulp'), {
  scripts: {
    include: {'build': 'Compile coffee with inline source-map.'}
  },
  buildWatch: ['index.coffee']
})

gulp.task('dev', 'DEVELOP', ['build', 'build:watch'])
