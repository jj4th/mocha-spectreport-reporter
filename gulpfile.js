var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  replaceString: /^gulp(-|\.)([0-9]+)?/
});

const fs          = require('fs');
const del         = require('del');
const path        = require('path');
const mkdirp      = require('mkdirp');
const isparta     = require('isparta');
const rollup      = require('rollup');

const manifest          = require('./package.json');
const config            = manifest.taskConfig;
const threshold         = manifest.threshold;
const mainFile          = manifest.main;
const destinationFolder = path.dirname(mainFile);
const exportFileName    = path.basename(mainFile, '.min.js');

const srcPath           = 'src/**/*.js';
const testPath          = 'test/**/*.spec.js';
const setupPath         = 'test/setup/node.js';
const watchPath         = [srcPath, 'test/**/*.js'];

function test() {
  return gulp.src([setupPath, testPath], {read: false})
    .pipe($.plumber())
    .pipe($.mocha({globals: config.mochaGlobals}));
}

// Remove the build files
gulp.task('clean', function(cb) {
  del([destinationFolder], cb);
});

// Remove our temporary files
gulp.task('clean-tmp', function(cb) {
  del(['tmp'], cb);
});

// Lint our source code
gulp.task('lint-src', function() {
  return gulp.src([srcPath])
    .pipe($.plumber())
    .pipe($.eslint({
      configFile: './.eslintrc',
      envs: [
        'node'
      ]
    }))
    .pipe($.eslint.formatEach('stylish', process.stderr))
    .pipe($.eslint.failOnError());
});

// Lint our test code
gulp.task('lint-test', function() {
  return gulp.src([testPath])
    .pipe($.plumber())
    .pipe($.eslint({
      configFile: './test/.eslintrc',
      envs: [
        'node'
      ]
    }))
    .pipe($.eslint.formatEach('stylish', process.stderr))
    .pipe($.eslint.failOnError());
});

// Build two versions of the library
gulp.task('build', ['lint-src', 'clean'], function(done) {
  mkdirp.sync(destinationFolder);
  rollup.rollup({
    entry: config.entryFileName + '.js',
    external: ['spectreport', 'mocha', 'fs-extra']
  }).then(function(bundle) {
    var res = bundle.generate({
      sourceMap: 'inline',
      sourceMapFile: exportFileName + '.js',
      format: 'umd',
      moduleName: config.exportVarName
    });

    $.file(exportFileName + '.js', res.code, { src: true })
      .pipe($.plumber())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.babel({ blacklist: ['useStrict'] }))
      .pipe($.rename(exportFileName + '.min.js'))
      .pipe($.uglify())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(destinationFolder))
      .on('end', done);
  });
});

gulp.task('coverage', ['lint-src', 'lint-test'], function(done) {
  require('babel/register')({ modules: 'common' });
  gulp.src([srcPath])
    .pipe($.plumber())
    .pipe($.istanbul({ instrumenter: isparta.Instrumenter, includeUntested: true }))
    .pipe($.istanbul.hookRequire())
    .on('finish', function() {
      return test()
      .pipe($.istanbul.writeReports())
      .on('end', done);
    });
});

// Lint and run our tests
gulp.task('test', ['lint-src', 'lint-test'], function() {
  require('babel/register')({ modules: 'common' });
  return test();
});

// Just run the tests without lint
gulp.task('mocha', function() {
  require('babel/register')({ modules: 'common' });
  return test();
});

// An alias of test
gulp.task('default', ['test']);

// Watcher
gulp.task('watch', function () {
  return gulp.watch(watchPath, ['coverage', 'build']);
});
