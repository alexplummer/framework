
// Exports
// ============
// Tasks to export

module.exports = function () {
	gulp.start(gulpsync.sync([
		['generate-favicon','inject-favicon-markups'],
		'replace-html',
		'copy:fav'
	]));
};


// Variables
// ============
// Define paths used within this gulp file

var paths = {
	tmp:       '.tmp',
	dev:       '_dev',
	pub:       '_prod'
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


// Favicons
// ============
// Creates favicons based off of the below config

var FAVICON_DATA_FILE = paths.dev+'/img/brand/favicons/faviconData.json';

gulp.task('generate-favicon', function(done) {

	plugins.realFavicon.generateFavicon({
		masterPicture: paths.dev+'/img/brand/logo_main.png',
		dest: paths.dev+'/img/brand/favicons',
		iconsPath: 'img/brand/favicons',
		design: {
			ios: {
				pictureAspect: 'backgroundAndMargin',
				backgroundColor: '#ffffff',
				margin: '14%',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				},
				appName: 'app_name'
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: '#2b5797',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				},
				appName: 'app_name'
			},
			androidChrome: {
				pictureAspect: 'noChange',
				themeColor: '#ffffff',
				manifest: {
					name: 'app_name',
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'silhouette',
				themeColor: '#5bbad5'
			}
		},
		settings: {
			compression: 3,
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false
		},
		versioning: {
			paramName: 'v',
			paramValue: '6'
		},
		markupFile: FAVICON_DATA_FILE
	}, function() {
		done();
	});
});


// Inject Favicons
// ============
// Injects the favicon links into head of HTML

gulp.task('inject-favicon-markups', function() {
	gulp.src(paths.dev+'/html/includes/_head.html')
		.pipe(plugins.realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(gulp.dest(paths.dev+'/html/includes/'));
});


// HTML
// ============
// Tidies up the duplicate tags from inject task

gulp.task('replace-html', function(){
  gulp.src(paths.dev+'/html/includes/_head.html')
    .pipe(plugins.replace('</body></html>', ''))
    .pipe(plugins.replace('<link rel="shortcut icon" href="img/brand/favicons/favicon.ico?v=6">', ''))
    .pipe(plugins.replace('<meta name="apple-mobile-web-app-title" content="app_name">', ''))
    .pipe(plugins.replace('<meta name="application-name" content="app_name">', ''))
    .pipe(gulp.dest(paths.dev+'/html/includes/'));
});


// Copy favicon.ico
// ============
// For the sakes of IE...

gulp.task('copy:fav', function() {
	gulp.src(paths.dev+'/img/brand/favicons/favicon.ico')
	.pipe(plugins.copy(paths.dev,{prefix:4}));
});
