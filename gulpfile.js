/*
Task reference:

NAME |FUNCTION
==============
gulp             | Starts localhost for development
gulp prod        | Builds production ready code and asssets
gulp psi         | Builds then generates Google PSI reports
gulp ngrok       | Builds then sets up localhost tunnel to outside world
gulp report      | Runs further tests like accessibility checks
gulp favicon     | Creates major icons into _dev (setup in ./tasks)
gulp deploy      | Builds then deploys via FTP (setup in ftp task)

FLAGS
==============
--rev         | Add this to end one of above for versioned JS/CSS (eg. gulp --rev)
--optimise    | Further optimises project, toggle tasks at bottom
--phpext      | Replaces HTML file extentions with PHP, used for Couch CMS

*/


// Variables
// ============
// Define paths used within this gulp file

let paths = {
	tmp: '.tmp',
	dev: '_dev',
	prod: '_prod'
};


// Linting
// ============
// Get lint reports in browser

let browserReports = false;


// FTP dest folder
// ============
// For when using FTP task, check FTP task first

let ftpFolder = '';


// Reqs
// ============
// Require definitions and auto plugin require setup

let gulp = require('gulp'),
	fs = require('fs'),
	critical = require('critical').stream,
	wiredep = require('wiredep').stream,
	argv = require('yargs').argv,
	gulpsync = require('gulp-sync')(gulp),
	spawn = require('child_process').spawn,
	plugins = require('gulp-load-plugins')({
		pattern: ['*'],
		replaceString: /\bgulp[\-.]/,
		lazy: true,
		camelize: true
	});


// Require dirs
// ============
// Pull in task modules from folder

let requireDir = require('require-dir');
requireDir('./tasks');


// Error handling
// ============
// Error response for plumber

let onError = err => {
	plugins.notify.onError({
		title: "<%= error %>",
		subtitle: "Line: <%= error.line %>",
		message: "<%= error.message %>",
		sound: "Beep"
	})(err);
};


// Clean
// ============
// Cleaning tasks for builds

gulp.task('clean:tmp', cb => {
	plugins.rimraf(paths.tmp + '/**/*', cb);
});
gulp.task('clean:prod', cb => {
	plugins.rimraf(paths.prod + '/**/*', cb);
});
gulp.task('clean:html', cb => {
	plugins.rimraf(paths.tmp + '/*.html', cb);
});
gulp.task('clean:report', cb => {
	plugins.rimraf('./reports/index.html', cb);
});
gulp.task('clean:jsreports', cb => {
	plugins.rimraf('./reports/js/*', cb);
});
gulp.task('clean:cssreports', cb => {
	plugins.rimraf('./reports/css/*', cb);
});


// Create folders
// ============
// Creates folders if missing

gulp.task('create-folders', cb => {
	// List of folders to make
	let folders = ['./bower_components'];
	// Make dirs
	for (let i = 0; i < folders.length; i++) {
		plugins.mkdirp(folders[i]);
	}
	cb();
});


// Inject deps
// ============
// Inject SASS and JS components

gulp.task('inject-CSSdeps', () => {
	// Auto inject SASS components
	return gulp.src(paths.dev + '/style/style.scss')
		.pipe(plugins.inject(gulp.src(paths.dev + '/components/**/*.scss', { read: false }), {
			relative: true,
			starttag: '/* inject:componentImports */',
			endtag: '/* endinjectComponent */',
			transform: filepath => {
				return '@import "' + filepath + '";';
			}
		}))
		.pipe(gulp.dest(paths.dev + '/style'));
});


// Bower install
// ============
// Installs bower components

gulp.task('bower-install', () => {
	return plugins.bower();
});


// Bower inject
// ============
// Injects bower package JS/CSS from bower.json to project

gulp.task('bower-inject', () => {
	// JS + CSS injection
	let jsCSS = gulp.src(paths.tmp + '/*.html')
		.pipe(wiredep({
			devDependencies: true
		}))
		.pipe(gulp.dest(paths.tmp + '/'));
	// Image piping
	let img = gulp.src(plugins.mainBowerFiles('**/*.{jpg,png,gif}', { includeDev: true }))
		.pipe(gulp.dest(paths.dev + '/img'));
	// Font piping
	let font = gulp.src(plugins.mainBowerFiles('**/*.{ttf,eot,woff,woff2}', { includeDev: true }))
		.pipe(gulp.dest(paths.dev + '/font'));
	// Return streams
	return plugins.mergeStream(jsCSS, img, font);
});


// HTML
// ============
// HTML tasks such as compiling pug

gulp.task('html', () => {
	let htmlError = err => {
		plugins.notify.onError({
			title: "PUG: <%= error %>",
			sound: "Frog"
		})(err);
	};

	let output = '';
	// Handles Pug templates
	let pugCompile = gulp.src([paths.dev + '/html/*.pug', './components/*.pug'])
		// Error handling
		.pipe(plugins.plumber({ errorHandler: htmlError }))
		// Pug compilation
		.pipe(plugins.pug())
		.pipe(plugins.htmlPrettify())
		.pipe(gulp.dest(paths.tmp + '/'));

	// HTML lint
	let htmlLint = gulp.src([paths.tmp + '/**/*.html'])
		.pipe(plugins.htmlhint())
		.pipe(plugins.htmlhint.reporter())
		.pipe(gulp.dest(paths.tmp + '/'));

	// Return streams
	return plugins.mergeStream(pugCompile, htmlLint);
});


// CSS
// ============
// Stylesheet tasks such as compliling and linting SASS

gulp.task('build-sass', () => {
	let output = '';

	let sassError = err => {
		plugins.notify.onError({
			title: "<%= error.formatted %>",
			subtitle: "Line: <%= error.line %>",
			message: "<%= error.message %>",
			sound: "Frog"
		})(err);
	};

	// CSS tasks
	return gulp.src(paths.dev + '/style/style.scss')
		// Error handling
		.pipe(plugins.plumber({ errorHandler: sassError }))
		// Sourcemap init
		.pipe(plugins.sourcemaps.init())
		// Compile SASS
		.pipe(plugins.sass().on('error', function () {
			this.emit('end')
		}))
		// Lint CSS
		.pipe(plugins.if(browserReports, plugins.csslint({
			"adjoining-classes": false, "box-model": false, "box-sizing": false, "font-sizes": false,
			"duplicate-background-images": false, "ids": false, "order-alphabetical": false,
			"qualified-headings": false, "unique-headings": false, "universal-selector": false
		})))
		.pipe(plugins.if(browserReports, plugins.csslint.formatter('text', { logger: function (str) { output += str; } })))
		.pipe(plugins.if(browserReports, plugins.csslint.formatter('text', { logger: function (str) { output += str; } })))
		.on('end', function (err) { fs.writeFile('reports/css/css.html', output); })
		// Write sourcemap
		.pipe(plugins.sourcemaps.write('./'))
		.pipe(gulp.dest(paths.tmp + '/style/'))
		// Browsersync inject stream
		.pipe(plugins.browserSync.stream());
});


// Usemin
// ============
// Usemin tasks for CSS and JS builds

gulp.task('usemin', () => {
	return gulp.src(paths.tmp + '/*.html')
		.pipe(plugins.foreach((stream, file) => {
			return stream
				.pipe(plugins.plumber({ errorHandler: onError }))
				.pipe(plugins.usemin({
					jsAttributes: {
						async: true
					},
					js: [plugins.sourcemaps.init(),
					// Uglify JS
					plugins.uglify(),
					// Version if rev build
					plugins.if(argv.rev, plugins.rev()),
					// Write JS sourcemap
					plugins.sourcemaps.write('./')
					],
					css: [  // Minify CSS
						plugins.cssnano(),
						// Version if rev build
						plugins.if(argv.rev, plugins.rev()),
						// CSS autoprefixer
						plugins.autoprefixer({ browsers: ['last 2 versions'], cascade: false }),
						// Fix paths for things like bower dependencies
						plugins.replace('url(images', 'url(img'),
					]
				}))
				.pipe(gulp.dest(paths.tmp + '/usemin'));
		}));
});


// Fontello
// ============
// Pulls glyphicons from font/config.json

gulp.task('fontello', cb => {
	plugins.fontelloImport.getFont({
		host: 'http://fontello.com',
		config: paths.dev + '/font/fontello/config.json',
		font: paths.tmp + '/font/',
		css: paths.dev + '/style/fontello',
	}, cb);
});


// Copy
// ============
// Moves assets over to prod from tmp

// Fonts
gulp.task('copy:fonts', () => {
	let font = gulp.src(paths.dev + '/font/**/*')
		.pipe(plugins.copy(paths.tmp, { prefix: 1 }))
		.pipe(plugins.browserSync.stream());
	let fontello = gulp.src(paths.dev + '/style/fontello/')
		.pipe(plugins.copy(paths.tmp, { prefix: 1 }))
		.pipe(plugins.browserSync.stream());
	// Return streams
	return plugins.mergeStream(font, fontello);
});
// Images
gulp.task('copy:images', () => {
	return gulp.src(paths.dev + '/img/**/*.{png,gif,jpg}')
		.pipe(plugins.copy(paths.tmp, { prefix: 1 }))
		.pipe(plugins.browserSync.stream());
});
// Prod
gulp.task('copy:prod', () => {
	// HTML
	let html = gulp.src(paths.tmp + '/usemin/*.html')
		.pipe(plugins.copy(paths.prod, { prefix: 2 }));
	// CSS
	let css = gulp.src(paths.tmp + '/usemin/style/**/*')
		.pipe(plugins.newer(paths.prod + '/'))
		.pipe(plugins.copy(paths.prod, { prefix: 2 }));
	// CSS MAP
	let map = gulp.src(paths.tmp + '/style/**/*.map')
		.pipe(plugins.newer(paths.prod + '/'))
		.pipe(plugins.copy(paths.prod, { prefix: 1 }));
	// JS
	let js = gulp.src(paths.tmp + '/usemin/script/**/*')
		.pipe(plugins.newer(paths.prod + '/'))
		.pipe(plugins.copy(paths.prod, { prefix: 2 }));
	// FONTS
	let fonts = gulp.src(paths.tmp + '/font/**/*')
		.pipe(plugins.copy(paths.prod, { prefix: 1 }));
	// FAVICONS
	let favs = gulp.src(paths.dev + '/img/brand/favicons/**/*')
		.pipe(plugins.copy(paths.prod, { prefix: 1 }));
	// PHP
	let php = gulp.src(paths.dev + '/script/**/*.php')
		.pipe(plugins.newer(paths.prod + '/'))
		.pipe(plugins.copy(paths.prod, { prefix: 1 }));
	// HUMANS
	let humans = gulp.src(paths.dev + '/humans.txt')
		.pipe(plugins.copy(paths.prod, { prefix: 1 }));
	// HTACCESS
	let htaccess = gulp.src(paths.dev + '/.htaccess.txt')
		.pipe(plugins.copy(paths.prod, { prefix: 1 }));
	// Return streams
	return plugins.mergeStream(html, css, map, js, fonts, favs, php, humans, htaccess);
});


// SVG
// ============
// Optimises SVGs

gulp.task('svg', () => {
	return gulp.src(paths.dev + '/img/**/*.svg')
		// Error handling
		.pipe(plugins.plumber({ errorHandler: onError }))
		.pipe(plugins.svgmin({
			plugins: [
				{ removeDoctype: true },
				{ removeComments: true },
				{
					cleanupNumericValues:
					{ floatPrecision: 2 }
				},
				{ removeDesc: true },
				{ removeTitle: true },
				{ removeEmptyAttrs: true },
				{ removeDimensions: true }
			]
		}))
		.pipe(gulp.dest(paths.tmp + '/img'))
		.pipe(plugins.browserSync.stream());
});


// SVG inline
// ============
// Inlines SVGs

gulp.task('svg-inline', () => {
	return gulp.src(paths.tmp + '/**/*.html')
		.pipe(plugins.inline({
			base: paths.tmp + '/',
			disabledTypes: ['css', 'img', 'js']
		}))
		.pipe(gulp.dest(paths.tmp));
});


// Images
// ============
// Optimises imagery and copy assets

gulp.task('images', () => {
	return gulp.src(paths.tmp + '/img/**/*')
		// Error handling
		.pipe(plugins.plumber({ errorHandler: onError }))
		.pipe(plugins.imagemin({
			progressive: true
		}))
		.pipe(gulp.dest(paths.prod + '/img'));
});


// Server
// ============
// Fires up a local server to run the site

gulp.task('connect', () => {
	// Kills tab after close
	plugins.browserSync.use({
		/* jshint ignore:start */
		plugin() { },
		/* jshint ignore:end */
		hooks: {
			'client:js': plugins.browserSyncCloseHook
		}
	});
	// Fires up browserSync
	plugins.browserSync.init({
		server: {
			baseDir: paths.tmp + "/",
			routes: {
				"/bower_components": "bower_components"
			}
		}
	});
});


// Lint Reports
// ============
// Creates and opens lint report page

gulp.task('lint-reports', () => {
	// Get new report
	gulp.src('./reports/template/index.html')
		.pipe(plugins.if(browserReports, plugins.copy('./reports', { prefix: 2 })));
	// Inject lints
	gulp.src('./reports/index.html')
		.pipe(plugins.if(browserReports, plugins.inject(gulp.src('./reports/css/css.html'), {
			relative: true,
			starttag: '<!-- inject:cssReport -->',
			transform: (filePath, file) => {
				return file.contents.toString('utf8');
			}
		})))
		.pipe(plugins.if(browserReports, plugins.inject(gulp.src('./reports/js/js.html'), {
			relative: true,
			starttag: '<!-- inject:jsReport -->',
			transform: (filePath, file) => {
				return file.contents.toString('utf8');
			}
		})))
		.pipe(plugins.if(browserReports, plugins.removeEmptyLines()))
		.pipe(gulp.dest('./reports/'));
	// Open report
	let openCheck = false;
	// Check for CSS lints
	fs.stat('./reports/css/css.html', (err, stat) => {
		if (err == null) {
			open();
		} else {
			console.log('No CSS lints!');
			// Check for JS lints
			fs.stat('./reports/js/js.html', (err, stat) => {
				if (err == null) {
					open();
				} else {
					console.log('No JS lints!');
				}
			});
		}
	});
	function open() {
		gulp.src('reports/index.html')
			.pipe(plugins.if(browserReports, plugins.open({ app: 'google chrome' })));
	}
});


// ngrok
// ============
// Creates local server then a global tunnel through ngrok

let site = '';
gulp.task('ngrok-server', () => {
	return plugins.connect.server({
		root: paths.prod + '/',
		port: 3020,
		livereload: true
	});
});
gulp.task('ngrok-url', cb => {
	return plugins.ngrok.connect(3020, (err, url) => {
		site = url;
		console.log('serving your tunnel from: ' + site);
		cb();
	});
});


// PSI reports
// ============
// Google PSI reports for desktop and mobile, requires ngrok

gulp.task('psi-desktop', cb => {
	return plugins.psi.output(site, { nokey: 'true', strategy: 'desktop' });
});
gulp.task('psi-mobile', cb => {
	return plugins.psi.output(site, { nokey: 'true', strategy: 'mobile' });
});


// Gulp stop
// ============
// Stops any gulp processes

gulp.task('gulp-stop', cb => {
	process.exit();
});


// Deploy
// ============
// Deploys assets via FTP

gulp.task('ftpDeploy', () => {

	// Enter details into ftp-security.json (in the root of the framework folder)
	// and place one folder up outside of project to avoid deploying it
	let fs = require('fs'),
		ftp = JSON.parse(fs.readFileSync('../ftp-security.json')),
		conn = plugins.vinylFtp.create({
			host: ftp.values.host,
			user: ftp.values.user,
			password: ftp.values.password,
			parallel: 8,
			log: plugins.util.log
		});
	return gulp.src(paths.prod + '/**/*.*', { base: paths.prod + '/', buffer: false })
		.pipe(conn.newer(ftpFolder))
		.pipe(conn.dest(ftpFolder));
});


// Favicons
// ============
// Creates a variety of favicons, setup first in 'tasks' folder

gulp.task('favicon', () => {
	gulp.start(gulpsync.sync([
		['generate-favicon', 'inject-favicon-markups'],
		'replace-html',
		'copy:fav'
	]))
});


// Accessibility
// ============
// Grades site to WCAG guidelines

gulp.task('accessibility', () => {
	return gulp.src(paths.prod + '/*.html')
		.pipe(plugins.accessibility({
			force: true,
			accessibilityLevel: 'WCAG2AA',
			reportLevels: {
				notice: false,
				warning: false,
				error: true
			}
		}))
		.pipe(plugins.accessibility.report({ reportType: 'txt' }))
		.pipe(plugins.rename({
			extname: '.html'
		}))
		.pipe(gulp.dest('reports/accessibility'));
});


// Critical CSS
// ============
// Adds index-critical.html with critical CSS

gulp.task('critical', () => {
	console.log('(Critical takes some time, only works with stylesheet as style.css - no rev)');
	return gulp.src(paths.prod + '/*.html')
		.pipe(plugins.if(argv.optimise, critical({
			base: paths.prod,
			inline: true,
			minify: true,
			dimensions: [{ width: 320, height: 480 }, { width: 768, height: 1024 }, { width: 1280, height: 960 }],
			css: [paths.prod + '/style/style.css']
		})))
		.pipe(gulp.dest(paths.prod));
});


// Sprites
// ============
// Adds images to a spritemap and updates CSS links

gulp.task('sprites', () => {
	let spriteData = gulp.src(paths.dev + '/img/sprites/*')
		.pipe(plugins.spritesmith({
			imgName: '../img/sprite.png',
			cssName: '_sprites.scss'
		}));
	spriteData.img.pipe(gulp.dest(paths.dev + '/img/'));
	spriteData.css.pipe(gulp.dest(paths.dev + '/style/global'));
});


// Min-html
// ============
// Minifies HTML

gulp.task('htmlmin', () => {
	return gulp.src(paths.prod + '/**/*.html')
		.pipe(plugins.if(argv.optimise, plugins.htmlmin({ collapseWhitespace: true, conservativeCollapse: true })))
		.pipe(gulp.dest(paths.prod));
});


// Uncss
// ============
// Scans HTML and removes unused CSS

gulp.task('uncss', () => {
	return gulp.src(paths.prod + '/style/*.css')
		.pipe(plugins.if(argv.optimise, plugins.uncss({
			html: [paths.prod + '/*.html'],
			ignore: []
		})))
		.pipe(gulp.dest(paths.prod + '/style'));
});


// PHP ext
// ============
// Changes HTML ext to PHP

gulp.task('phpext', () => {
	return gulp.src(paths.prod + '/*.html')
		.pipe(plugins.vinylPaths(plugins.del))
		.pipe(plugins.rename(function (path) {
			path.extname = ".php"
		}))
		.pipe(gulp.dest(paths.prod));
});


// Depcheck
// ============
// Check for unused dependencies

gulp.task('depcheck', plugins.depcheck({
	ignoreDirs: ['_dev']
}));


// Watch
// ============
// Perfom tasks based on file changes

gulp.task('watch', () => {
	// NEW COMPONENT
	plugins.watch([paths.dev + '/components/component-list.json'], () => {
		gulp.start(gulpsync.sync([
			'watch:messageNEW', 'create-component'
		]));
	});
	// SASS
	plugins.watch([paths.dev + '/**/*.scss', '!'+paths.dev + '/components/component-list.json'], () => {
		gulp.start(gulpsync.sync([
			'watch:messageSASS', [/*'clean-reports',*/ 'build-sass']
		]));
	});
	// COMPONENTS
	plugins.watch([paths.dev + '/components/**/*.*', '!'+paths.dev + '/components/**/*.scss', '!'+paths.dev + '/components/component-list.json'], () => {
		gulp.start(gulpsync.sync([
			'watch:messageCOMPONENTS', 'inject-CSSdeps'
		]));
	});
	// HTML
	plugins.watch(paths.dev + '/**/*.pug', () => {
		gulp.start(gulpsync.sync([
			'watch:messageHTML', 'clean:html', 'html', 'svg-inline', 'bower-inject', 'watch:reload'
		]));
	});
	// JS
	plugins.watch(paths.dev + '/**/*.js', () => {
		gulp.start(gulpsync.sync([
			'watch:messageJS', /*'clean-reports',*/ 'js', ['inject-JSdeps', 'copy:scripts']
		]));
	});
	// IMAGES
	plugins.watch(paths.dev + '/img/**/*.*', () => {
		gulp.start(gulpsync.sync([
			'watch:messageIMAGES', 'copy:images'
		]));
	});
	// SVG
	plugins.watch(paths.dev + '/img/**/*.*svg', () => {
		gulp.start(gulpsync.sync([
			'watch:messageIMAGES', 'svg'
		]));
	});
	// FONTELLO
	plugins.watch(paths.dev + '/font/config.json', () => {
		gulp.start(gulpsync.sync([
			'watch:messageFONTELLO', ['fontello', 'clean-reports', 'build-sass'], ['lint-reports', 'copy:fonts']
		]));
	});
	// BOWER
	plugins.watch('bower_components/**/*', () => {
		gulp.start(gulpsync.sync([
			'watch:messageBOWER', 'bower-inject'
		]));
	});
	// GULP
	plugins.watch(['gulpfile.js', 'tasks/*.*'], () => {
		gulp.start(gulpsync.sync([
			'watch:messageGULP', 'watch:gulp'
		]));
	});
});

// Watch messages
gulp.task('watch:message', function reload() { console.log('-* WATCH TRIGGERED *-'); });
gulp.task('watch:messageNEW', function reload() { console.log('-* WATCH TRIGGERED: COMPONENT FOLDER *-'); });
gulp.task('watch:messageSASS', function reload() { console.log('-* WATCH TRIGGERED: SASS *-'); });
gulp.task('watch:messageCOMPONENTS', function reload() { console.log('-* WATCH TRIGGERED: COMPONENTS *-'); });
gulp.task('watch:messageHTML', function reload() { console.log('-* WATCH TRIGGERED: HTML *-'); });
gulp.task('watch:messageJS', function reload() { console.log('-* WATCH TRIGGERED: JS *-'); });
gulp.task('watch:messageIMAGES', function reload() { console.log('-* WATCH TRIGGERED: IMAGES *-'); });
gulp.task('watch:messageFONTELLO', function reload() { console.log('-* WATCH TRIGGERED: FONTELLO *-'); });
gulp.task('watch:messageBOWER', function reload() { console.log('-* WATCH TRIGGERED: BOWER *-'); });
gulp.task('watch:messageGULP', function reload() { console.log('-* GULP FILE CHANGED, PLEASE RESTART *-'); });

// Watch tasks
gulp.task('watch:reload', function reload() {
	plugins.browserSync.reload();
	console.log('(Watching)');
});
gulp.task('watch:gulp', () => {
	process.exit();
});


// Builds
// ============
// List of different builds

// Build to tmp
gulp.task('build:tmp', gulpsync.sync([
	'clean:tmp', 'create-folders', 'svg', 'js',
	['bower-install', 'component-directories', 'fontello', 'copy:fonts', 'inject-CSSdeps', 'inject-JSdeps'],
	['copy:scripts', 'copy:images', 'sprites'],
	'build-sass',
	['html'],
	'svg-inline',
	'bower-inject'
]));

// Offline only build to tmp
gulp.task('build:tmp-offline', gulpsync.sync([
	'clean:tmp', 'create-folders', 'svg', 'js',
	['component-directories', 'copy:fonts', 'inject-CSSdeps', 'inject-JSdeps'],
	['copy:scripts', 'copy:images', 'sprites'],
	'build-sass',
	['html'],
	'svg-inline',
	'bower-inject'
]));

// Build to prod
gulp.task('build:prod', gulpsync.sync([
	'usemin',
	'copy:prod',
	'images',
	'optimise',
	//'couch'
]));


// Optimising tasks
// ============
// Optional optimising tasks

gulp.task('optimise', gulpsync.sync([
	//'uncss',
	'critical',
	//'htmlmin',
]));


// Tasks
// ============
// Main Gulp tasks

// Default Gulp
gulp.task('default', gulpsync.sync([
	'build:tmp',
	'connect',
	'watch'
]), () => {
	console.log('(Watching)');
});

// Gulp when offline
gulp.task('offline', gulpsync.sync([
	'build:tmp-offline',
	'connect',
	'watch'
]), () => {
	console.log('(Watching)');
});

// Builds prod out
gulp.task('prod', gulpsync.sync([
	'build:tmp',
	'clean:prod',
	'build:prod'
]));

// Builds then deploys via FTP
gulp.task('deploy', gulpsync.sync([
	'prod',
	'ftpDeploy'
]));

// Cleans report folders
gulp.task('clean-reports', gulpsync.async([
	'clean:report',
	'clean:jsreports',
	'clean:cssreports'
]));

// Runs PSI tests
gulp.task('psi', gulpsync.sync([
	'prod',
	'ngrok-server',
	'ngrok-url',
	'psi-desktop',
	'psi-mobile',
	'gulp-stop'
]));

// Local to external tunnel
gulp.task('ngrok', gulpsync.sync([
	'prod',
	'ngrok-server',
	'ngrok-url'
]));

// Generate further reports
gulp.task('report', gulpsync.sync([
	'prod',
	'accessibility'
]));

// Couch CMS tasks
gulp.task('couch', gulpsync.sync([
	'phpext',
	'couchIncludes',
	'couchExcludes'
]));