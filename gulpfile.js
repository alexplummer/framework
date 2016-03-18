/*Task summaries

NAME |FUNCTION
==============
gulp        |Cleans public folder, builds site and starts localhost 
gulp build  |Builds site to public

*/


// Reqs
// ============
// Load plugins in packages.json automatically 

var gulp    = require('gulp'),
	wiredep = require('wiredep').stream,
	plugins = require('gulp-load-plugins')({
							pattern: ['*'],
							replaceString: /\bgulp[\-.]/,
							lazy: true,
							camelize: true});


// Variables
// ============
// Define variables used within this gulp file

var paths = {
	lib:    '.lib',
	dev:    '_dev',
	pub:    '_public',
	config: 'setup.json'
}


// Clean
// ============
// Cleans out the public folder before build

gulp.task('clean', function () {
	return gulp.src(paths.pub, {read: false})
	.pipe(plugins.clean());
});


// Bower 
// ============
// Injects bower package JS/CSS from bower.json to project

gulp.task('bower', ['clean'], function () {
	gulp.src(paths.dev+'/_head.shtml')
	.pipe(wiredep({
		devDependencies: true
	}))
	.pipe(gulp.dest(paths.dev));
	gulp.src(paths.dev+'/_under.shtml')
	.pipe(wiredep({
		devDependencies: true
	}))
	.pipe(gulp.dest(paths.dev));
});


// Inject deps
// ============
// Inject SASS and JS imports and dependencies

gulp.task('inject-deps', function() {
	gulp.src(paths.dev+'/style/style.scss')
	.pipe(inject(gulp.src(['../components/**/*.scss'], {read: false, cwd: (paths.dev+'/style'}), {
		starttag: '/* inject:imports */',
		endtag: '/* endinject */',
		transform: function (filepath) {
			return '@import "' + filepath + '";';
		}
	}))
	.pipe(gulp.dest(paths.dev+'/style'));
	gulp.src(paths.dev+'/script/script.js')
	.pipe(inject(gulp.src(['../components/**/*.js'], {read: false, cwd: (paths.dev+'/script'}), {
		starttag: '/* inject:imports */',
		endtag: '/* endinject */',
		transform: function (filepath) {
			return '@import".' + filepath + '";';
		}
	}))
	.pipe(gulp.dest(paths.dev+'/script'));
});


// CSS
// ============
// Stylesheet tasks such as compliling SASS

gulp.task('build-css', ['bower','fontello'], function() {
	gulp.src(paths.dev+'/style/style.scss')
	// SASS
	.pipe(plugins.sass())
	.pipe(gulp.dest(paths.pub+'/style/style.css'));
	// Minification & copy
	gulp.src(paths.dev+'/_head.shtml')
	.pipe(plugins.usemin({
		css: [ plugins.rev() ],
		inlinecss: [ plugins.minifyCss(), 'concat' ]
	}))
	.pipe(gulp.dest(paths.pub+'/'));
});


// JS 
// ============
// Javascript tasks such as linting

gulp.task('build-js', ['bower'], function() {
		gulp.src(paths.dev+'/_under.shtml')
		// Linting
	.pipe(plugins.jshint.extract('auto'))
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'))
		// Minification & copy
		.pipe(plugins.usemin({
			js: [ plugins.uglify(), plugins.rev() ],
			inlinejs: [ plugins.uglify() ]
		}))
		.pipe(gulp.dest(paths.pub+'/'));
});


// Fontello
// ============
// Pulls glyphicons from font/config.json

gulp.task('fontello', function(done) {
		plugins.fontelloImport.getFont({
				host           : 'http://fontello.com',
				config         : paths.dev+'/font/config.json',
			font: paths.dev+'/font/',
			css: paths.dev+'/style/fontello',
		},done);
});


// Copy
// ============
// Moves assets over to prod

gulp.task('copy', ['fontello','build-css','build-js'], function() {
	gulp.src(paths.dev+'/**.shtml')
	.pipe(plugins.copy(paths.pub,{prefix:1}));
	gulp.src(paths.dev+'/font/**.*')
	.pipe(plugins.copy(paths.pub,{prefix:1}));
});


// Images
// ============
// Optimises imagery and copy assets

gulp.task('images', ['clean'], () => {
	return gulp.src(paths.dev+'/img')
		.pipe(plugins.imagemin({
			progressive: true
		}))
		.pipe(gulp.dest(paths.pub+'/img'));
});


// Server
// ============
// Fires up a local server to run the site

gulp.task('connect', ['copy'], function() {
	plugins.connect.server({
		root: paths.dev,
		livereload: true,
		middleware: function() {
				return [plugins.connectSsi({
					ext: '.shtml',
						baseDir: paths.pub
				})];
			}
	});
});


// Open
// ============
// Fires up a local server to run the site

gulp.task('open', ['connect'], function() {
	gulp.src('')
	.pipe(plugins.open({app: 'chrome', uri: 'http://localhost:8080'}));
});


// Watch
// ============
// Perfom tasks based on file changes

gulp.task('watch', function(){
	plugins.watch(paths.dev+'/**/*.js',['jshint']);
	plugins.watch(paths.dev+'/**/*.scss',['build-css']);
});


// Tasks
// ============
// Define gulp tasks

gulp.task('build', ['clean','bower','fontello','build-css','build-js','copy','images']);
gulp.task('default', ['build','connect','open','watch']);
