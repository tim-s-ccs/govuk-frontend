'use strict'

const paths = require('./config/paths.json')
const { src, dest, series, parallel } = require('gulp')
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
const { startSassdoc } = require('./tasks/gulp/sassdoc.js')

// Copy assets task ----------------------
// Copies assets to taskArguments.destination (public)
// --------------------------------------
function copyAssets () {
  return src(paths.src + 'assets/**/*')
    .pipe(dest(taskArguments.destination + '/assets/'))
}

// Umbrella scripts tasks for preview ---
// Runs js lint and compilation
// --------------------------------------
exports.scripts = series(jsLint, jsCompile)

// Umbrella styles tasks for preview ----
// Runs scss lint and compilation
// --------------------------------------
exports.styles = series(scssLint, scssCompile)

// Copy assets task for local & heroku --
// Copies files to
// taskArguments.destination (public)
// --------------------------------------
exports.copyJSAndSCSS = series(exports.styles, exports.scripts)

// Serve task ---------------------------
// Restarts node app when there is changed
// affecting js, css or njk files
// --------------------------------------
exports.serve = parallel(watchFiles, nodemon)

// Dev task -----------------------------
// Runs a sequence of task on start
// --------------------------------------
exports.dev = series(clean, exports.copyJSAndSCSS, startSassdoc, exports.serve)

// Build package task -----------------
// Prepare package folder for publishing
// -------------------------------------
exports.buildPackage = series(clean, copyFiles, jsCompile, jsCopyEsm)

exports.buildDist = series(clean, exports.copyJSAndSCSS, copyAssets, updateAssetsVersion)

// Default task -------------------------
// Lists out available tasks.
// --------------------------------------
exports.default = taskListing
