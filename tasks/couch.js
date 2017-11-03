
// Variables
// ============
// Define paths used within this gulp file

let paths = {
    tmp: '.tmp',
    dev: '_dev',
    prod: '_prod'
};


// Reqs
// ============
// Load plugins in packages.json automatically

let gulp = require('gulp'),
    fs = require('fs'),
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


// Component directories
// ============
// Builds a list of directories in components

let oldDirs = [];

gulp.task('component-directories', (cb) => {
    oldDirs = fs.readdirSync((paths.dev + '/components/'));
    cb();
});


// Couch assets
// ============
// Replaces with Couch CMS absolute path

gulp.task('couchIncludes', function () {
	return gulp.src(paths.prod + '/*.php')
		.pipe(plugins.replace('href="style', 'href="<cms:show k_site_link />style'))
		.pipe(plugins.replace('src="script', 'src="<cms:show k_site_link />script'))
		.pipe(plugins.replace('href="img', 'href="<cms:show k_site_link />img'))
		.pipe(plugins.replace('src="img', 'src="<cms:show k_site_link />img'))
		.pipe(plugins.replace('a href="', 'a href="<cms:show k_site_link />'))
		.pipe(plugins.replace('index.html', '<cms:show k_site_link />index.php'))
		.pipe(plugins.replace('about.html', '<cms:show k_site_link />about.php'))
		.pipe(plugins.replace('news.html', '<cms:show k_site_link />news.php'))
		.pipe(plugins.replace('article.html', '<cms:show k_site_link />article.php'))
		.pipe(plugins.replace('work.html', '<cms:show k_site_link />work.php'))
		.pipe(plugins.replace('chat.html', '<cms:show k_site_link />chat.php'))
		.pipe(plugins.replace('legal.html', '<cms:show k_site_link />legal.php'))
		.pipe(plugins.replace('credits.html', '<cms:show k_site_link />credits.php'))
		.pipe(gulp.dest(paths.prod));
});

gulp.task('couchExcludes', function () {
	return gulp.src(paths.prod + '/*.php')
		.pipe(plugins.replace('<a href="<cms:show k_site_link /><cms:show k_page_link />">', '<a href="<cms:show k_page_link />">'))
		.pipe(plugins.replace('=""',''))
		.pipe(plugins.replace('&lt;','<'))
		.pipe(plugins.replace('&gt;','>'))
		.pipe(plugins.replace('">"</cms:show>','/>'))
		.pipe(plugins.replace('">"</cms:date>','/>'))
		.pipe(plugins.replace('&quot;/>&quot;','/>'))
		.pipe(plugins.replace('image_2>">','image_2 />">'))
		.pipe(plugins.replace('image_3>">','image_3 />">'))
		.pipe(plugins.replace('">" </cms:show>','/>'))
		.pipe(plugins.replace('">" </cms:paginator>','/>'))
		.pipe(plugins.replace('">"','/>'))
		.pipe(plugins.replace('</cms:show>',''))
		.pipe(plugins.replace('</cms:search_form>',''))
		.pipe(plugins.replace('<cms:show k_site_link /><cms:show k_page_link />','<cms:show k_page_link />'))
		.pipe(plugins.replace('"/>"\'','/>\''))
		.pipe(plugins.replace('"/>"/img','/>/img'))
		.pipe(plugins.replace('<cms:show k_site_link /><cms:show k_site_link />','<cms:show k_site_link />'))
		.pipe(plugins.replace('<cms:show folder_link_custom>','<a href="<cms:add_querystring "<cms:link masterpage=\'news.php\' />" "cat=<cms:show k_folder_name/>" />"#k_search_form><cms:show k_folder_title /></a> <br>'))
		.pipe(gulp.dest(paths.prod));
});
