'use strict'

var gulp =  require('gulp');
var watch = require('gulp-watch');
var babel = require('gulp-babel');

gulp.task('transform', () => {
        return gulp.src('server/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist/server'));
});

gulp.task('watch', () => {
       return gulp.src('server/**/*.js')
        .pipe(watch('server/**/*.js', {
            verbose: true
        }))
        .pipe(babel())
        .pipe(gulp.dest('dist/server'));
});

gulp.task('default', () => {
    return gulp.start('transform');
});
