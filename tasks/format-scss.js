
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


// Format CSS
// ============
// Orders properties and formats stylesheets

gulp.task('format-scss', () => {
	let postcss = require('gulp-postcss');
	let postscss = require('postcss-scss');
	let sorting = require('postcss-sorting');

	return gulp.src(paths.dev + '/components/**/*.scss')
		.pipe(plugins.stylefmt(
			{
				'rules': {
					'indentation': 'tab',
					'string-quotes': 'double',
					'no-duplicate-selectors': true,
					'color-hex-case': 'upper',
					'color-hex-length': 'long',
					'color-named': 'never',
					'block-opening-brace-newline-before': 'never',
					'block-opening-brace-newline-after': 'never',
					'block-opening-brace-space-before': 'never',
					'block-opening-brace-space-after': 'never',
					'block-closing-brace-empty-line-before': 'never',
					'block-closing-brace-newline-before': 'never',
					'block-closing-brace-newline-after': 'never',
					'block-closing-brace-space-before': 'never',
					'block-closing-brace-space-after': 'never',
					'selector-combinator-space-after': 'always',
					'selector-attribute-quotes': 'always',
					'selector-attribute-operator-space-before': 'never',
					'selector-attribute-operator-space-after': 'always',
					'selector-attribute-brackets-space-inside': 'never',
					'declaration-block-trailing-semicolon': 'always',
					'declaration-colon-space-before': 'never',
					'declaration-colon-space-after': 'always',
					'number-leading-zero': 'never',
					'function-url-quotes': 'always',
					'font-family-name-quotes': 'always-where-recommended',
					'comment-whitespace-inside': 'always',
					'comment-empty-line-before': 'always',
					'rule-empty-line-before': 'never',
					'selector-pseudo-element-colon-notation': 'single',
					'selector-pseudo-class-parentheses-space-inside': 'never',
					'media-feature-range-operator-space-before': 'always',
					'media-feature-range-operator-space-after': 'always',
					'media-feature-parentheses-space-inside': 'never',
					'media-feature-colon-space-before': 'never',
					'media-feature-colon-space-after': 'always'
				}
			}
		))
		.pipe(plugins.csscomb())
		.pipe(plugins.postcss([
			sorting({
				'properties-order': [
					'@include',
					'@extend',
					'display',
					'position',
					'top',
					'right',
					'bottom',
					'left',
					'width',
					'min-width',
					'max-width',
					'height',
					'min-height',
					'max-height',
					'margin',
					'margin-top',
					'margin-right',
					'margin-bottom',
					'margin-left',
					'padding',
					'padding-top',
					'padding-right',
					'padding-bottom',
					'padding-left',
					'float',
					'clear',
					'columns',
					'column-gap',
					'column-fill',
					'column-rule',
					'column-span',
					'column-count',
					'column-width',
					'transform',
					'transition',
					'border',
					'border-top',
					'border-right',
					'border-bottom',
					'border-left',
					'border-width',
					'border-top-width',
					'border-right-width',
					'border-bottom-width',
					'border-left-width',
					'border-style',
					'border-top-style',
					'border-right-style',
					'border-bottom-style',
					'border-left-style',
					'border-radius',
					'border-top-left-radius',
					'border-top-right-radius',
					'border-bottom-left-radius',
					'border-bottom-right-radius',
					'border-color',
					'border-top-color',
					'border-right-color',
					'border-bottom-color',
					'border-left-color',
					'outline',
					'outline-color',
					'outline-offset',
					'outline-style',
					'outline-width',
					'background',
					'background-color',
					'background-image',
					'background-repeat',
					'background-position',
					'background-size',
					'cursor',
					'color',
					'font',
					'font-family',
					'font-size',
					'font-smoothing',
					'font-style',
					'font-variant',
					'font-weight',
					'letter-spacing',
					'line-height',
					'list-style',
					'text-align',
					'text-decoration',
					'text-indent',
					'text-overflow',
					'text-rendering',
					'text-shadow',
					'text-transform',
					'text-wrap',
					'white-space',
					'word-spacing',
					'border-collapse',
					'border-spacing',
					'box-shadow',
					'caption-side',
					'content',
					'cursor',
					'empty-cells',
					'opacity',
					'overflow',
					'quotes',
					'speak',
					'table-layout',
					'vertical-align',
					'visibility',
					'z-index'
				]
			})
		], { syntax: postscss }))
		.pipe(gulp.dest(paths.dev + '/components/'));
});