/*
Task reference:

NAME |FUNCTION
==============
gulp          | Starts localhost for development
gulp prod     | Builds production ready code and asssets
gulp psi      | Builds then generates Google PSI reports
gulp ngrok    | Builds then sets up localhost tunnel to outside world
gulp report   | Runs further tests like accessibility checks
gulp favicon  | Creates major icons into _dev (setup in ./tasks)
gulp deploy   | Builds then deploys via FTP (setup in ftp task)

FLAGS
==============
--rev         | Add this to end one of above for versioned JS/CSS (eg. gulp --rev)
--optimise    | Further optimises project, toggle tasks at bottom
--phpext      | Replaces HTML file extentions with PHP, used for Couch CMS

*/


// Variables
// ============
// Define paths used within this gulp file

var paths = {
	tmp:       '.tmp',
	dev:       '_dev',
	prod:       '_prod'
};


// Linting
// ============
// Get lint reports in browser

var browserReports = false;


// FTP dest folder
// ============
// For when using FTP task, check FTP task first

var ftpFolder = '/serverfolder';


// Reqs
// ============
// Require definitions and auto plugin require setup

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


// Require dirs
// ============
// Pull in task modules from folder

var requireDir = require('require-dir');
requireDir('./tasks');


// Error handling
// ============
// Error response for plumber

var onError = err => {
  plugins.util.beep();
  console.log(err);
};


// Clean
// ============
// Cleaning tasks for builds

gulp.task('clean:tmp', cb => {
	plugins.rimraf(paths.tmp+'/**/*', cb);
});
gulp.task('clean:prod', cb => {
	plugins.rimraf(paths.prod+'/**/*', cb);
});
gulp.task('clean:html', cb => {
	plugins.rimraf(paths.tmp+'/*.html', cb);
});
gulp.task('clean:report', cb => {
	plugins.rimraf( './reports/index.html', cb);
});
gulp.task('clean:jsreports', cb => {
	plugins.rimraf( './reports/js/*', cb);
});
gulp.task('clean:cssreports', cb => {
	plugins.rimraf( './reports/css/*', cb);
});


// Create folders
// ============
// Creates folders if missing

gulp.task('create-folders', cb => {
	// List of folders to make
	var folders = ['./bower_components'];
	// Make dirs
	for (var i=0; i<folders.length;i++) {
		plugins.mkdirp(folders[i]);
	}
	cb();
});


// Inject deps
// ============
// Inject SASS and JS components

gulp.task('inject-CSSdeps', () => {
	// Auto inject SASS components
	return gulp.src(paths.dev+'/style/style.scss')
	.pipe(plugins.inject(gulp.src('components/**/*.scss', {read: false, cwd:paths.dev+'/style/'}), {
		relative: true,
		starttag: '/* inject:componentImports */',
		endtag: '/* endinjectComponent */',
		transform: filepath => {
			return '@import "' + filepath + '";';
		}
	}))
	.pipe(gulp.dest(paths.dev+'/style'));
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
	var jsCSS = gulp.src(paths.tmp+'/*.html')
	.pipe(wiredep({
		devDependencies: true
	}))
	.pipe(gulp.dest(paths.tmp+'/'));
	// Image piping
	var img = gulp.src(plugins.mainBowerFiles('**/*.{jpg,png,gif}',{includeDev:true}))
	.pipe(gulp.dest(paths.dev+'/img'));
	// Font piping
	var font = gulp.src(plugins.mainBowerFiles('**/*.{ttf,eot,woff,woff2}',{includeDev:true}))
	.pipe(gulp.dest(paths.dev+'/font'));
	// Return streams
	return plugins.mergeStream(jsCSS, img, font);
});


// HTML
// ============
// HTML tasks such as compiling pug

gulp.task('html', () => {
	var output = '';
	// Handles Pug templates
	return gulp.src(paths.dev+'/html/*.pug')
	// Error handling
	.pipe(plugins.plumber({errorHandler: onError}))
	// Pug compilation
	.pipe(plugins.pug())
	.pipe(plugins.htmlPrettify())
	// HTML lint
	.pipe(plugins.htmlhint())
    .pipe(plugins.htmlhint.reporter())
	.pipe(gulp.dest(paths.tmp+'/'))
	.pipe(plugins.browserSync.stream());
});


// CSS
// ============
// Stylesheet tasks such as compliling and linting SASS

gulp.task('build-sass', () => {
	var output = '';
	// CSS tasks
	return gulp.src(paths.dev+'/style/style.scss')
	// Error handling
	.pipe(plugins.plumber({errorHandler: onError}))
	// Sourcemap init
	.pipe(plugins.sourcemaps.init())
	// Compile SASS
	.pipe(plugins.sass().on('error', plugins.notify.onError()))
	// Lint CSS
	.pipe(plugins.if(browserReports, plugins.csslint({
		"adjoining-classes": false,"box-model": false,"box-sizing": false, "font-sizes": false,
        "duplicate-background-images": false,"ids": false,"order-alphabetical": false,
		"qualified-headings": false,"unique-headings": false,"universal-selector": false})))
	.pipe(plugins.if(browserReports, plugins.csslint.formatter('text', {logger: function(str) { output += str; }})))
	.pipe(plugins.if(browserReports, plugins.csslint.formatter('text', {logger: function(str) { output += str; }})))
    .on('end', function(err) {fs.writeFile('reports/css/css.html', output);})
	// Write sourcemap
	.pipe(plugins.sourcemaps.write('./'))
	.pipe(gulp.dest(paths.tmp+'/style/'))
	// Browsersync inject stream
	.pipe(plugins.browserSync.stream());
});


// Usemin
// ============
// Usemin tasks for CSS and JS builds

gulp.task('usemin', () => {
	return gulp.src(paths.tmp+'/*.html')
	.pipe(plugins.foreach((stream, file) => {
	return stream
		.pipe(plugins.plumber({errorHandler: onError}))
		.pipe(plugins.usemin({
		js:  [  plugins.sourcemaps.init(),
				// Uglify JS
			    plugins.uglify(),
				// Version if rev build
			    plugins.if(argv.rev,  plugins.rev()),
				// Write JS sourcemap
				plugins.sourcemaps.write('./')
		     ],
		css: [  // Minify CSS
				plugins.minifyCss(),
				// Version if rev build
			    plugins.if(argv.rev,  plugins.rev()),
				// CSS autoprefixer
			    plugins.autoprefixer({browsers: ['last 2 versions'],cascade: false}),
				// Fix paths for things like bower dependencies
				plugins.replace('url(images','url(img'),
		     ]
		}))
		.pipe(gulp.dest(paths.tmp+'/usemin'));
	}));
});


// Fontello
// ============
// Pulls glyphicons from font/config.json

gulp.task('fontello', cb => {
	plugins.fontelloImport.getFont({
		host:   'http://fontello.com',
		config: paths.dev+'/font/fontello/config.json',
		font:   paths.tmp+'/font/',
		css:    paths.dev+'/style/fontello',
	},cb);
});


// Copy
// ============
// Moves assets over to prod from tmp

gulp.task('copy:fonts', () => {
	var font = gulp.src(paths.dev+'/font/**/*')
	.pipe(plugins.copy(paths.tmp,{prefix:1}))
	.pipe(plugins.browserSync.stream());
	var fontello = gulp.src(paths.dev+'/style/fontello/')
	.pipe(plugins.copy(paths.tmp,{prefix:1}))
	.pipe(plugins.browserSync.stream());
	// Create folder if doesn't exists 
	
	// Return streams
	return plugins.mergeStream(font, fontello);
});
gulp.task('copy:images', () => {
	return gulp.src(paths.dev+'/img/**/*')
	.pipe(plugins.copy(paths.tmp,{prefix:1}))
	.pipe(plugins.browserSync.stream());
});
gulp.task('copy:prod', () => {
	// HTML
	var html = gulp.src(paths.tmp+'/usemin/*.html')
	.pipe(plugins.copy(paths.prod,{prefix:2}));
	// CSS
	var css = gulp.src(paths.tmp+'/usemin/style/**/*')
	.pipe(plugins.newer(paths.prod+'/'))
	.pipe(plugins.copy(paths.prod,{prefix:2}));
	// CSS MAP
	var map = gulp.src(paths.tmp+'/style/**/*.map')
	.pipe(plugins.newer(paths.prod+'/'))
	.pipe(plugins.copy(paths.prod,{prefix:1}));
	// JS
	var js = gulp.src(paths.tmp+'/usemin/script/**/*')
	.pipe(plugins.newer(paths.prod+'/'))
	.pipe(plugins.copy(paths.prod,{prefix:2}));
	// FONTS
	var fonts = gulp.src(paths.tmp+'/font/**/*')
	.pipe(plugins.copy(paths.prod,{prefix:1}));
	// PHP
	var php = gulp.src(paths.dev+'/script/**/*.php')
	.pipe(plugins.newer(paths.prod+'/'))
	.pipe(plugins.copy(paths.prod,{prefix:1}));
	// HUMANS
	var humans = gulp.src(paths.dev+'/humans.txt')
	.pipe(plugins.copy(paths.prod,{prefix:1}));
	// Return streams
	return plugins.mergeStream(html, css, map, js, fonts, php, humans);
});


// Images
// ============
// Optimises imagery and copy assets

gulp.task('images', () => {
	return gulp.src(paths.tmp+'/img/**/*')
	// Error handling
	.pipe(plugins.plumber({errorHandler: onError}))
	.pipe(plugins.imagemin({
		progressive: true
	}))
	.pipe(gulp.dest(paths.prod+'/img'));
});


// Server
// ============
// Fires up a local server to run the site

gulp.task('connect', () => {
	// Kills tab after close
	plugins.browserSync.use({
		/* jshint ignore:start */
		plugin() {},
		/* jshint ignore:end */
		hooks: {
		  'client:js': plugins.browserSyncCloseHook
		}
	});
	// Fires up browserSync
	plugins.browserSync.init({
		server: {
			baseDir: paths.tmp,
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
	.pipe(plugins.if(browserReports, plugins.copy('./reports',{prefix:2})));
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
	var openCheck = false;
	// Check for CSS lints
	fs.stat('./reports/css/css.html', (err, stat) => {
		if(err == null) {
			open();
		} else {
			console.log('No CSS lints!');
			// Check for JS lints
			fs.stat('./reports/js/js.html', (err, stat) => {
				if(err == null) {
					open();
				} else {
					console.log('No JS lints!');
				}
			});
		}
	});
	function open() {
		gulp.src('reports/index.html')
		.pipe(plugins.if(browserReports, plugins.open({app: 'google chrome'})));
	}
});


// ngrok
// ============
// Creates local server then a global tunnel through ngrok

var site      = '';
gulp.task('ngrok-server', () => {
return plugins.connect.server({
    root:  paths.prod+'/',
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
  return plugins.psi.output(site, {nokey: 'true', strategy: 'desktop'});
});
gulp.task('psi-mobile', cb => {
  return plugins.psi.output(site, {nokey: 'true', strategy: 'mobile'});
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
    var fs      = require('fs'),
		ftp     = JSON.parse(fs.readFileSync('../ftp-security.json')),
		conn    = plugins.vinylFtp.create( {
        host:     ftp.values.host,
        user:     ftp.values.user,
        password: ftp.values.password,
        parallel: 8,
        log:      plugins.util.log
    });
    return gulp.src(paths.prod+'/**', {base: paths.prod+'/', buffer: false })
	.pipe(conn.newer(ftpFolder))
    .pipe(conn.dest(ftpFolder));
});


// Favicons
// ============
// Creates a variety of favicons, setup first in 'tasks' folder

gulp.task( 'favicon', () =>{
    gulp.start(gulpsync.sync([
	['generate-favicon','inject-favicon-markups'],
	'replace-html',
	'copy:fav'
	]))
});


// Accessibility
// ============
// Grades site to WCAG guidelines

gulp.task('accessibility', () => {
  return gulp.src(paths.prod+'/*.html')
    .pipe(plugins.accessibility({
      force: true
    }))
    .pipe(plugins.accessibility.report({reportType: 'txt'}))
    .pipe(plugins.rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('reports/accessibility'));
});


// Critical CSS
// ============
// Adds index-critical.html with critical CSS

gulp.task('critical', () => {
	return plugins.critical.generate({
        inline: true,
		base: paths.prod,
		src: 'index.html',
        dest:  paths.prod+'/index-critical.html',
        minify: true,
	    dimensions: [{width:320,height:480},{width:768,height:1024},{width:1280,height:960}]
	});
});


// Sprites
// ============
// Adds images to a spritemap and updates CSS links

gulp.task('sprites', () => {
    var spriteData = gulp.src(paths.dev+'/img/sprites/*')
	.pipe(plugins.spritesmith({
		imgName: '../img/sprite.png',
		cssName: '_sprites.scss'
	}));
    spriteData.img.pipe(gulp.dest(paths.dev+'/img/'));
	spriteData.css.pipe(gulp.dest(paths.dev+'/style/library'));
});


// Gzip
// ============
// Gzips files so server doesn't have to

gulp.task('gzip', () => {
	return gulp.src(paths.prod+'/**/*.{html,xml,json,css,js}')
	.pipe(plugins.if(argv.optim,  plugins.gzip()))
    .pipe(gulp.dest(paths.prod));
});


// Min-html
// ============
// Minifies HTML

gulp.task('htmlmin', () => {
	return gulp.src(paths.prod+'/**/*.html')
	.pipe(plugins.if(argv.optim,  plugins.htmlmin({collapseWhitespace: true, conservativeCollapse: true})))
    .pipe(gulp.dest(paths.prod));
});


// Uncss
// ============
// Scans HTML and removes unused CSS

gulp.task('uncss', () => {
	return gulp.src('site.css')
	.pipe(plugins.if(argv.optim,  plugins.uncss({html: [paths.prod+'/*.html']})))
	.pipe(gulp.dest(paths.prod));
});


// PHP ext
// ============
// Changes HTML ext to PHP

gulp.task('phpext', () => {
	return gulp.src(paths.prod+'/*.html')
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
  ignoreDirs: [ '_dev' ]
}));


// Couch assets
// ============
// Replaces with Couch CMS absolute path

gulp.task('couchIncludes', () => {
	return gulp.src(paths.prod+'/*.php')
   	.pipe(plugins.replace('', ''))
	.pipe(gulp.dest(paths.prod));
});
gulp.task('couchExcludes', () => {
	return gulp.src(paths.prod+'/*.php')
   	.pipe(plugins.replace('', ''))
	.pipe(gulp.dest(paths.prod));
});


// Watch
// ============
// Perfom tasks based on file changes

gulp.task('watch', () =>{
	// SASS
	plugins.watch([paths.dev+'/**/*.scss','!' + paths.dev+'/style/components/**/*.scss'], () => {gulp.start(gulpsync.sync([
		'watch:messageSASS',['clean-reports','build-sass'],'lint-reports'
	]));});
	// COMPONENTS
	plugins.watch(paths.dev+'/style/components/**/*.scss', () => {gulp.start(gulpsync.sync([
		'watch:messageCOMPONENTS','inject-CSSdeps'
	]));});
	// HTML
	plugins.watch(paths.dev+'/**/*.pug', () => {gulp.start(gulpsync.sync([
		'watch:messageHTML','clean:html','html','bower-inject','watch:reload'
	]));});
	// JS
	plugins.watch(paths.dev+'/**/*.js', () => {gulp.start(gulpsync.sync([
		'watch:messageJS','clean-reports','js',['inject-JSdeps', 'copy:scripts'],'lint-reports'
	]));});
	// IMAGES
	plugins.watch(paths.dev+'/img/**/*.*', () => {gulp.start(gulpsync.sync([
		'watch:messageIMAGES','copy:images'
	]));});
	// FONTELLO
	plugins.watch(paths.dev+'/font/config.json', () => {gulp.start(gulpsync.sync([
		'watch:messageFONTELLO',['fontello','clean-reports','build-sass'],['lint-reports','copy:fonts']
	]));});
	// BOWER
	plugins.watch('bower_components/**/*', () => {gulp.start(gulpsync.sync([
		'watch:messageBOWER','bower-inject'
	]));});
	// GULP
	plugins.watch('gulpfile.js', () => {gulp.start(gulpsync.sync([
		'watch:messageGULP','watch:gulp'
	]));});
});

// Watch messages
gulp.task('watch:message', function reload() {console.log('-* WATCH TRIGGERED *-');});
gulp.task('watch:messageSASS', function reload() {console.log('-* WATCH TRIGGERED: SASS *-');});
gulp.task('watch:messageCOMPONENTS', function reload() {console.log('-* WATCH TRIGGERED: COMPONENTS *-');});
gulp.task('watch:messageHTML', function reload() {console.log('-* WATCH TRIGGERED: HTML *-');});
gulp.task('watch:messageJS', function reload() {console.log('-* WATCH TRIGGERED: JS *-');});
gulp.task('watch:messageIMAGES', function reload() {console.log('-* WATCH TRIGGERED: IMAGES *-');});
gulp.task('watch:messageFONTELLO', function reload() {console.log('-* WATCH TRIGGERED: FONTELLO *-');});
gulp.task('watch:messageBOWER', function reload() {console.log('-* WATCH TRIGGERED: BOWER *-');});
gulp.task('watch:messageGULP', function reload() {console.log('-* GULP FILE CHANGED, PLEASE RESTART *-');});

// Watch tasks
gulp.task('watch:reload', function reload() {
	plugins.browserSync.reload();
	console.log('(Watching)');
});
gulp.task('watch:gulp', () => {
	process.exit();
});


// Tasks
// ============
// List of main gulp tasks

// BUILDS
gulp.task('build:tmp', gulpsync.sync([
	'clean:tmp','create-folders','js',
	['bower-install','fontello','copy:fonts','inject-CSSdeps', 'inject-JSdeps','clean-reports'],
	['copy:scripts','copy:images','sprites'],
	'build-sass',
	['lint-reports','html'],
	'bower-inject'
]));
gulp.task('build:prod', gulpsync.sync([
	'usemin',
	'copy:prod',
	'images',
	//'couch',
	//'optimise'
]));

// OPTIMISING TASKS
gulp.task('optimise', gulpsync.sync([
	'uncss',
	'critical',
	'htmlmin',
	'gzip'
]));

// TASKS
gulp.task('default', gulpsync.sync([
	'build:tmp',
	'connect',
	'watch',
	'clean:prod',
	'build:prod'
]), () => {console.log('(Watching)');
});
gulp.task('prod', gulpsync.sync([
	'build:tmp',
	'clean:prod',
	'build:prod'
]));
gulp.task('deploy', gulpsync.sync([
	'prod',
	'ftpDeploy'
]));
gulp.task('clean-reports', gulpsync.async([
	'clean:report',
	'clean:jsreports',
	'clean:cssreports'
]));
gulp.task('psi', gulpsync.sync([
	'prod',
	'ngrok-server',
	'ngrok-url',
	'psi-desktop',
	'psi-mobile',
	'gulp-stop'
]));
gulp.task('ngrok', gulpsync.sync([
	'prod',
	'ngrok-server',
	'ngrok-url'
]));
gulp.task('report', gulpsync.sync([
	'prod',
	'accessibility'
]));
gulp.task('couch', gulpsync.sync([
	'phpext',
	'couchIncludes',
	'couchExcludes'
]));
