
// Variables
// ============
// Define paths used within this gulp file

var paths = {
	tmp:       '.tmp',
	dev:       '_dev',
	prod:      '_prod'
};


// Reqs
// ============
// Load plugins in packages.json automatically

var gulp     = require('gulp'),
	fs       = require('fs'),
	wiredep  = require('wiredep').stream,
	argv     = require('yargs').argv,
	gulpsync = require('gulp-sync')(gulp),
	spawn    = require('child_process').spawn,
	plugins  = require('gulp-load-plugins')({
				pattern: ['*'],
				replaceString: /\bgulp[\-.]/,
				lazy: true,
				camelize: true});


// Linting
// ============
// Get lint reports in browser

var browserReports = false;


// Inject deps
// ============
// Inject SASS and JS modules

gulp.task('inject-JSdeps', () => {
	// Auto inject JS
	return gulp.src(paths.dev+'/html/includes/_under.pug')
	.pipe(plugins.inject(gulp.src('**/*.js', {read: false, cwd:paths.tmp+'/script/'}), {
		relative: true,
		ignorePath: '../../../.tmp/',
		starttag: '<!-- inject:imports -->',
		endtag: '<!-- endinject -->',
		transform: filepath => {
			return '<script src="' + filepath + '"></script>';
		}
	}))
	.pipe(gulp.dest(paths.dev+'/html/includes/'));
});


// JS
// ============
// Changes dependent on framework version

gulp.task('js', () => {
	// Package up ES6 modules
	return plugins.rollupStream({
		entry: paths.dev+'/script/app.js',
		sourceMap: true,
		format: 'iife',
		moduleName: 'app',
		plugins: [
			plugins.rollupPluginIncludepaths({paths:[paths.dev+'/script/']})
		]
	})
	.on('error', plugins.util.log)
	// Prepare files for sourcemap
	.pipe(plugins.vinylSourceStream('app.js', paths.dev+'/script/'))
	.pipe(plugins.vinylBuffer())
	.pipe(plugins.sourcemaps.init({loadMaps: true}))
	// Convert ES6
	.pipe(plugins.babel({presets: ['es2015']}))
	// Write sourcemap
	.pipe(plugins.sourcemaps.write('.'))
	.pipe(gulp.dest(paths.tmp+'/script/'));
});


// Copy scripts
// ============
// In this framework version runs JS hint, updates browser stream

gulp.task('copy:scripts', cb => {
	// JS hint
	gulp.src(paths.tmp+'/script/script/**/*.js')
	.pipe(plugins.jshint())
	.pipe(plugins.if(browserReports, plugins.jshint.reporter('gulp-jshint-file-reporter', {
    	filename: 'reports/js/js.html'
	})))
	.pipe(plugins.jshint.reporter('default'))
	.pipe(plugins.jshintNotifyReporter())
	// Update browser
	.pipe(plugins.browserSync.stream());
	cb();
})