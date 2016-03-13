/*Task summaries

NAME: FUNCTION
==============
gulp: Cleans prod folder, builds site and starts localhost 

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
              camelize: true
    });



// Variables
// ============
// Define variables used within this gulp file

var paths = {
	lib:    '_lib',
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



// Wiredep 
// ============
// Injects bower package JS/CSS from bower.json to project

gulp.task('bower', function () {
  	gulp.src(paths.dev+'/index.html')
    .pipe(wiredep({
    	devDependencies: true
    }))
    .pipe(gulp.dest(paths.pub));
});



// CSS
// ============
// Stylesheet tasks such as compliling SASS

gulp.task('build-css', function() {
  	gulp.src(paths.dev+'/style/style.scss')
  	// SASS
    .pipe(plugins.sass())
    .pipe(gulp.dest(paths.pub+'/style/style.css'));
    // Minification & copy
    gulp.src(paths.dev+'/index.html')
    .pipe(plugins.usemin({
      css: [ plugins.rev() ],
      inlinecss: [ plugins.minifyCss(), 'concat' ]
    }))
    .pipe(gulp.dest(paths.pub+'/'));
});



// JS 
// ============
// Javascript tasks such as linting

gulp.task('build-js', function() {
  	return gulp.src(paths.dev+'/index.html')
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



// Server
// ============
// Fires up a local server to run the site

gulp.task('connect', function() {
	plugins.connect.server({
		root: '_dev/',
		livereload: true
	});
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

gulp.task('default', ['clean','bower','build-css','build-js','connect','watch']);