'use strict'

const paths = require('./config/paths.json')
const gulp = require('gulp')
const taskListing = require('gulp-task-listing')
const taskArguments = require('./tasks/gulp/task-arguments')

// Gulp sub-tasks
const { clean } = require('./tasks/gulp/clean.js')
const { jsCompile, scssCompile } = require('./tasks/gulp/compile-assets.js')
const { jsLint, scssLint } = require('./tasks/gulp/lint.js')
const { nodemon } = require('./tasks/gulp/nodemon.js')
const { watchFiles } = require('./tasks/gulp/watch.js')
// new tasks
const { copyFiles, jsCopyEsm } = require('./tasks/gulp/copy-to-destination.js')
const { updateAssetsVersion } = require('./tasks/gulp/asset-version.js')
require('./tasks/gulp/sassdoc.js')

// Umbrella scripts tasks for preview ---
// Runs js lint and compilation
// --------------------------------------
gulp.task('scripts', gulp.series(
  jsLint,
  jsCompile
))

// Umbrella styles tasks for preview ----
// Runs scss lint and compilation
// --------------------------------------
gulp.task('styles', gulp.series(
  scssLint,
  scssCompile
))

// Copy assets task ----------------------
// Copies assets to taskArguments.destination (public)
// --------------------------------------
gulp.task('copy:assets', () => {
  return gulp.src(paths.src + 'assets/**/*')
    .pipe(gulp.dest(taskArguments.destination + '/assets/'))
})

// Copy assets task for local & heroku --
// Copies files to
// taskArguments.destination (public)
// --------------------------------------
gulp.task('copy-assets', gulp.series(
  'styles',
  'scripts'
))

// Serve task ---------------------------
// Restarts node app when there is changed
// affecting js, css or njk files
// --------------------------------------
gulp.task('serve', gulp.parallel(
  watchFiles,
  nodemon
))

// Dev task -----------------------------
// Runs a sequence of task on start
// --------------------------------------
gulp.task('dev', gulp.series(
  clean,
  'copy-assets',
  'sassdoc',
  'serve'
))

// Build package task -----------------
// Prepare package folder for publishing
// -------------------------------------
gulp.task('build:package', gulp.series(
  clean,
  copyFiles,
  jsCompile,
  jsCopyEsm
))

gulp.task('build:dist', gulp.series(
  clean,
  'copy-assets',
  'copy:assets',
  updateAssetsVersion
))

// Default task -------------------------
// Lists out available tasks.
// --------------------------------------
gulp.task('default', taskListing)
