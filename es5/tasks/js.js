
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

gulp.task('inject-jsDeps', () => {
	// Auto inject JS
	return gulp.src(paths.dev+'/html/includes/_under.pug')
	.pipe(plugins.inject(gulp.src('**/*.js', {read: false, cwd:paths.dev+'/script/'}), {
		relative: true,
		ignorePath: '../../',
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
	// Empty in this version
});


// Copy scripts
// ============
// JS linting and copies to dev

gulp.task('copy:scripts', cb => {
	// JS hint
	gulp.src(paths.dev+'/script/**/*')
	.pipe(plugins.jshint())
	.pipe(plugins.if(browserReports, plugins.jshint.reporter('gulp-jshint-file-reporter', {
    	filename: 'reports/js/js.html'
	})))
	.pipe(plugins.jshint.reporter('default'))
	//.pipe(plugins.jshintNotifyReporter()) JS notify not working
	// Copy JS
	.pipe(plugins.newer(paths.tmp+'/script'))
	.pipe(plugins.copy(paths.tmp,{prefix:1}))
	.pipe(plugins.browserSync.stream());
	cb();
});