# The Feature Creep Frontend Framework

## Intro

### Background

Welcome to the personal framework of Alex Plummer. I have been using and adding to this framework over the last 5 years or so, during that time a lot has made it in as I worked on a variety of projects. I really like the idea of modular design and CSS, so there is a strong emphasis on type and size scales and vars. This framework has been made for frontend developers, Feel free to take and use as you please!

### Main features

There are a few different versions, including ES5, ES6, Angular and Phonegap, the following features may be different depending which flavour you are using:

- A focus on modular design and CSS, easy to setup colour palette, typography and scales for sizing and type
- Ultra lightweight, all standard browser components come pre-styled without being a heavy framework like Bootstrap
- Easy to use project structure with minimum level folder structure
- Auto injection for things like Bower, SASS modules, favicons (with auto generation) and Fontello assets means less hassle during development
- Optimisation/minification for all assets and files makes for light and fast production
- Easy app production or complex CMS tasks using just frontend techs
- Page speed insights, accessibility reports and linting for HTML, JS and CSS using system notifications or in browser reports
- Easy to deploy builds with Gulp FTP, Phonegap Build API integration and Couch CMS asset creation
- + Lots, lots more

### Tech stack

The framework has support for a fairly full stack of tech, although the emphasis is on the frontend as this is where I usually work. The included stack is as follows:

- Gulp forms the basis for the framework
- Pug is used for HTML templating
- SASS is the CSS preprocessor
- A choice of ES5 / ES6 / Angular flavours for JS
- Rollup is used for bundling modules
- Couch CMS for client authoring and backend tasks
- Phonegap Build API integration for mobile development

### TLDR

For a really quick rundown - with Gulp up and running and the packages installed use &#39;gulp&#39; from within one of the 4 main folders (ES5, ES6, Angular, Phonegap) to trigger localhost. Once you are ready &#39;gulp prod&#39; will build out your project to the \_prod folder.

### Prerequisites

You will need the following to get started with the framework:

### Windows

Install the following in this order, the build tools can take quite a while to run:

- Git
- Node
- Yarn or NPM
- Windows build tools ( [https://www.npmjs.com/package/windows-build-tools](https://www.npmjs.com/package/windows-build-tools))
- Gulp installed globally
- Bower installed globally

### Optional

Depending on your project you may need the following:

- Couch CMS installed on your server
- An account with Phonegap Build for mobile apps

### Setup

Once you have the above installed you can then grab the necessary packages by opening a console at the root of either the ES5, ES6 or Angular folders and running either &#39;yarn install&#39; or &#39;npm install&#39; depending on the package manager you are using. This will take some time to run as there are a lot of packages! After that has finished you should be good to go.

### Usage

These are the main tasks which can be run through Gulp, underneath are flags which can be added to the task to perform certain actions. Mostly you will just type &#39;gulp&#39; into the console to get started. Once you are ready for your production code you will use &#39;gulp prod&#39; which builds it out to the \_prod folder ready for use.

NAME | FUNCTION
==============

* gulp             | Starts localhost for development
* gulp offline     | Runs Gulp without making external calls
* gulp prod        | Builds production ready code and asssets
* gulp psi         | Builds then generates Google PSI reports
* gulp ngrok       | Builds then sets up localhost tunnel to outside world
* gulp report      | Runs further tests like accessibility checks
* gulp favicon     | Creates major icons into \_dev (setup in ./tasks)
* gulp deploy      | Builds then deploys via FTP (setup in ftp task)
* gulp couch       | Changes HTML to PHP then replaces certain inline paths
* gulp phonegap    | Builds, sends files to Phonegap and retrieves APK
* gulp phonegap-nb | As above but without main build

FLAGS
==============

* --rev         | Add this to end one of above for versioned JS/CSS
* --optimise    | Further optimises project, toggle tasks at bottom of this file
* --phpext      | Replaces HTML file extentions with PHP, used for Couch CMS

### Main structure

The framework is organised into the following main folders:

### \_dev

This is where you generally work out of, inside there are subfolders for things like HTML and CSS, these subfolders are explained below.

### .tmp

This is a hidden folder which everything holds compiled assets, you don&#39;t need to touch this.

### \_prod

All the compiled assets in \_tmp are optimised and organised into here for production.

### Development structure

The \_dev folder contains all the subfolders for things like HTML and CSS, they are as follows:

### html

This contains your Pug files. Inside here you have the following:

- The  &#39;\_vars&#39; folder which holds global Pug variables,
- The &#39;components&#39; folder which holds all of your modules
- The &#39;includes&#39; folder which has global document modules

### script

This contains your JS files, the ES6 version already has ES5 compilation and bundling setup for modules so you can use the ES6 module syntax out of the box.

### style

This is where the framework styles are kept and where you add in your own CSS. There are the following folders:

- &#39;components&#39; is where modules are added, any .scss files in here are auto injected into style.css
- &#39;library&#39; houses the main framework styles and mixins, you won&#39;t need to modify these
- &#39;setup&#39; contains the setup file which is where you control the colour, scale and typography variables for each project
- &#39;global&#39; is used for SCSS which is used in across your project rather than just one component
- &#39;fontello&#39; has all the font iconography files, these are automatically downloaded from the config file (see below in Font section) so you don&#39;t need to touch these

### img

This is where the images for your project live. Most images go in the root of this folder unless they are branding or media which go in these folders:

- &#39;brand&#39; is where your branding imagery goes like logos and favicons (these are auto-generated, see below) live
- &#39;media&#39; is used to hold content images for things like articles

### font

Fonts are kept in the root of this folder, there is also a Fontello subfolder. Replace the config.json in the fontello folder with your own Fontello config and the correct assets will be downloaded and automatically injected into the project (this can break so restart Gulp if they aren&#39;t immediately obvious)

### Getting started

The best place to usually start is in &#39;\_setup.scss&#39; as all of the main variables are here. Change the colour variables as are needed, you won&#39;t usually need all of these, the variety of variables are there so you can use those you need consistently. You can also add the font stacks you want to use in here. The values you enter here are used within other stylesheets which are in the &#39;library&#39; folder to generate the framework styles.

### Colour palette

The colour palette is based off of three main brand colours plus a couple of extras for shades and highlights if they are needed. Link colour is also specified here and impacts other parts of the framework such as buttons. For light and dark backgrounds and also the colour of most of your text there are light and dark variables. The full list of colour variables is as follows:

* $clr-primary:   #3C9ADA;
* $clr-secondary: #F3AF4B;
* $clr-tertiary:  #80007F;
* $clr-hlight:    #F6631E;
* $clr-shade:     #3F4747;

* $clr-link: $clr-hlight;
* $clr-link-hover: lighten($clr-link, 10%);

* $clr-light:   #BED4D2;
* $clr-lighter: #D8E7E6;
* $clr-dark:    #666666;
* $clr-darker:  #333333;

* $clr-primary-textoverlay:   #FFFFFF;
* $clr-secondary-textoverlay: #FFFFFF;
* $clr-tertiary-textoverlay:  #FFFFFF;
* $clr-hlight-textoverlay:    #FFFFFF;
* $clr-shade-textoverlay:     #FFFFFF;

### Typography

Add in your font stacks for header elements, body text and also quotes. Usually 3 font families is more than enough for a site. There are also variables to modify the size of type slightly if the xheights of header or body fonts are particularly out of sync with normal font sizes. The variables are as follows:

* $font-header: &#39;Montserrat&#39;, sans-serif;
* $font-body:   &#39;Open Sans&#39;, sans-serif;
* $font-quote:  &#39;Bevan&#39;, cursive;

* $xheight-header: 1;
* $xheight-body:   1;

### Scales

The framework uses two scales with &#39;tshirt-size&#39; variables names, one for general distances such as margins and padding and another for font sizes. The font scale is based off of the classical font scale which is fairly well known and works quite well. It uses rems for measurements as these work responsively. The most important size is the body font size as this is usually used most commonly on a site. The default body font size in nearly every browser is 16px, so there are example pixel values based off of this in comments to give you an idea of perspective. The baseline is then used to create the size distances, which are used for margin and padding distances. All distances in your project should be in multiples of the baseline value, this creates a harmonious layout and rhythm to the page (trust me it will look sharp). You probably don&#39;t need to change any of these, but you could use a different scale if you wanted. The scales are as follows:

// Font sizes
* $font-xxxl: /\* 96px \*/ 6      \* 1rem;
* $font-xxl:  /\* 48px \*/ 3      \* 1rem;
* $font-xl:   /\* 36px \*/ 2.25   \* 1rem;
* $font-l:    /\* 24px \*/ 1.5    \* 1rem;
* $font-m:    /\* 18px \*/ 1.125  \* 1rem;
* $font-s:    /\* 16px \*/ 1      \* 1rem;
* $font-xs:   /\* 12px \*/ 0.75   \* 1rem;
* $font-xxs:  /\*  9px \*/ 0.5625 \* 1rem;

// Baseline
* $font-size-body: $font-s;
* $font-baseline: $font-size-body \* 1.5;

// Distances
* $size-xl: /\* 96px \*/ $font-baseline \* 4;
* $size-l:  /\* 48px \*/ $font-baseline \* 2;
* $size-m:  /\* 24px \*/ $font-baseline;
* $size-s:  /\* 12px \*/ $font-baseline / 2;

### Grid

The framework uses the flexbox grid ( [http://flexboxgrid.com](http://flexboxgrid.com)) however I have shifted it over to use Sass placeholders (use &#39;%col-md-6&#39; for example) as these don&#39;t get compiled unless used. You can setup the vars for the flexbox grid if you like, but you most likeky won&#39;t need to change them

### Framework components

There are some components already baked into the framework, these are controlled manually in &#39;style.css&#39;. Here are a few of them, check out the demo page which is included for a better look:

### Forms

The framework uses Pure forms which are responsive, check out the documentation here: [https://purecss.io/forms/](https://purecss.io/tables/)

### Buttons

There is a button style already included, you can use any of the following selectors to extend it: .button, %button, %btn, input[type=&quot;submit&quot;]

### Tables

The framework uses Pure tables which are super minimal, check out the documentation here: [https://purecss.io/tables/](https://purecss.io/tables/)

### Typography

Most typography should work out of the box, you can see some examples on the included demo page.

### Extending components

In order to keep things light there are just the bare bones in terms of components. You can either create the ones you need for each project or download them from places like Bower or Polymer.

### Gulp tasks

There are lots of common tasks included in the framework, here are some of the more important ones:

### &#39;gulp favicon&#39;

Uses an icon called &#39;logo-mark.png&#39; in the brand folder within img to create and inject a whole range of favicons for every application. You can change the settings within the favicon task which is kept separately in the tasks folder.

### &#39;gulp deploy&#39;

Uses FTP details to upload prod assets to remote server. You need to copy the &#39;ftp-security.json&#39; file and place it one level up from your project so it&#39;s not included in git commits.

### &#39;gulp psi&#39;

Runs page speed insights for your site, will give you a report in the command prompt.

### &#39;gulp ngrok&#39;

Serves your site through a tunnel so you can access it remotely using the URL that given. Useful for demoing or testing your site remotely.
