![alt text](http://alexplummer.com/img/toolbox.png)

# The Feature Creep Frontend Framework

## Background

Welcome to the personal framework of Alex Plummer. I have been using and adding to this framework over the last 5 years or so, during that time a lot has made it in as I worked on a variety of projects. The main principles I have worked towards are those of automation and speed. I also really like the idea of modular design and CSS, so there is a strong emphasis on type and size scales and vars. This framework has been made for frontend developers, Feel free to take and use as you please!

### Main features

- Automated workflow, this means components are easily created, dependencies are automatically injected and optimisation/deployment are a breeze
- Quick to build, for most projects CSS and JS streams are injected into localhost almost instantly
- A focus on modular design and CSS, easy to setup colour palette, typography and scales for sizing and type
- Ultra lightweight, standard elements come styled but you won’t find all the components Bootstrap has, however you also won’t have to overwrite all that mud!
- Easy to use project structure with minimum levels for folder
- Auto generation of favicons, Fontello assets created from just a config file, Animate.css toggled with one list of booleans
- Optimisation/minification for all assets and files makes for light and fast production, includes a boilerplate for recommended HTML meta and .htaccess
- CouchCMS integration for when you need a backend or content management without doing anything
- Phonegap Build integration for easy to build and package apps
- Page speed insights, accessibility reports and linting for HTML, JS and CSS using system notifications
- Easy to deploy builds with Gulp FTP
- + Lots, lots more (I did call it feature creep for a reason)

### Tech stack

The framework has support for a fairly full stack of tech, although the emphasis is on the frontend as this is where I usually work. The included stack is as follows:

- Gulp forms the basis for the framework
- Pug is used for HTML templating
- SASS is the CSS preprocessor
- ES6 is compiled for backwards compatibility
- Rollup is used for bundling modules
- Couch CMS for client authoring and backend tasks
- Phonegap Build API integration for mobile development

## TLDR

For a really quick rundown - with Gulp up and running and the packages installed use &#39;gulp&#39; to trigger localhost. Once running add new components to component-list.json and they will be automatically built out into a new folder. When you are ready &#39;gulp prod&#39; will build out your project to the \_prod folder.

## Prerequisites

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

## Setup

Once you have the above installed you can then grab the necessary packages by opening a console at the root and running either &#39;yarn install&#39; or &#39;npm install&#39; depending on the package manager you are using. This will take some time to run as there are a lot of packages! After that has finished you should be good to go.

## Usage

These are the main tasks which can be run through Gulp, underneath are flags which can be added to the task to perform certain actions. Mostly you will just type &#39;gulp&#39; into the console to get started. Once you are ready for your production code you will use &#39;gulp prod&#39; which builds it out to the \_prod folder ready for use.

### NAME | FUNCTION
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

### FLAGS
==============

* --rev         | Add this to end one of above for versioned JS/CSS
* --optimise    | Further optimises project, toggle tasks at bottom of this file
* --phpext      | Replaces HTML file extentions with PHP, used for Couch CMS

## Main structure

The framework is organised into the following main folders:

### \_dev

This is where you generally work out of, inside there are subfolders for things like components and global HTML and CSS, these subfolders are explained below.

### .tmp

This is a hidden folder which everything holds compiled assets, you don&#39;t need to touch this.

### \_prod

All the compiled assets in \_tmp are optimised and organised into here for production.

## Development structure

The \_dev folder contains all the subfolders for things like HTML and CSS, they are as follows:

### components

The framework is component based but not in an overly complicated way. This folder holds all components in one place and doesn’t distinguish between different levels of atomic design as this can lead to delayed development time as you sift around various folders. If you have any global code there is a space for these in each of the html, script and style folders.

#### Adding a new component
Adding new components is easy, with Gulp running simply open components-list.json in this folder and add a new entry with the name and description of the component. All the Pug, Sass and JS files will be created, named and injected for you. If you prefer to do all this manually then you can just ignore components-list.json.

#### Removing a component
Removing components is done manually to avoid accidental deletion. Remove any unwanted components from both the folder and components-list.json. 

### html

This contains global Pug markup and your main pages. Inside here you have the following:

- All the main site pages like index where you add in components
- The  &#39;\_vars&#39; folder which holds global Pug variables that are used in places such as meta or for contact or social links
- The &#39;mixins&#39; folder which has useful global Pug mixins
- The &#39;includes&#39; folder which has global modules such as json-ld and the head and under sections of the document

### script

This contains your global JS files as well as app.js:

- app.js is the main controller for all of your JS
- The &#39;global&#39; folder contains any global scripts which aren’t tied to a component
- The &#39;library&#39; folder contains some functions which come already included with the framework

#### app.js

This is used to import all of your JS and call various functions depending on page. You can modify the body class var in each of you main Pug pages and then use this to decide which JS should run on which page. There are some examples setup for you already.

### style

This is where the framework styles are kept as well as the central style.scss which calls in all the other stylesheets. There are the following folders:

- style.scss is where all the other stylesheets are called in, any .scss files found in the components directory are auto-injected here
- &#39;library&#39; houses the main framework styles and mixins, you won&#39;t need to modify these
- &#39;setup&#39; contains the setup file which is where you control the colour, scale and typography variables for each project
- &#39;global&#39; is used for Sass which is used in across your project rather than just one component. There are a variety of commonly used stylesheets already in here which you can add to. Animate.css is controlled from here and any auto-generated sprite Sass is also here.
- &#39;fontello&#39; has all the font iconography files, these are automatically downloaded from the config file (see below in Font section) so you don&#39;t need to touch these

### img

This is where the images for your project live. Most images go in the root of this folder unless they are branding or media which go in these folders:

- &#39;brand&#39; is where your branding imagery goes like logos and favicons (these are auto-generated, see below) live
- &#39;media&#39; is used to hold content images for things like articles
- &#39;sprites&#39; this is where auto-generated sprites are kept

### font

Fonts are kept in the root of this folder, there is also a Fontello subfolder. Replace the config.json in the fontello folder with your own Fontello config and the correct assets will be downloaded and automatically injected into the project (this can break so restart Gulp if they aren&#39;t immediately obvious)

## Getting started

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

The framework includes the flexbox grid ( [http://flexboxgrid.com](http://flexboxgrid.com)) which is good for creating quick responsive grids or you could just use the standard CSS Grid with some media queries instead. The flexbox grid is configured with Sass placeholders (use &#39;%col-md-6&#39; for example) as these don&#39;t get compiled unless used. You can setup the vars for the flexbox grid if you like, but you most likely won&#39;t need to change them

## Framework components

There are some components already baked into the framework, these are controlled manually in &#39;style.css&#39;. Here are a few of them:

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

#### &#39;gulp favicon&#39;

Uses an icon called &#39;logo-mark.png&#39; in the brand folder within img to create and inject a whole range of favicons for every application. You can change the settings within the favicon task which is kept separately in the tasks folder.

#### &#39;gulp deploy&#39;

Uses FTP details to upload prod assets to remote server. You need to copy the &#39;ftp-security.json&#39; file and place it one level up from your project so it&#39;s not included in git commits.

#### &#39;gulp psi&#39;

Runs page speed insights for your site, will give you a report in the command prompt.

#### &#39;gulp ngrok&#39;

Serves your site through a tunnel so you can access it remotely using the URL that given. Useful for demoing or testing your site remotely.

### Additional helpers

Aside from the tasks above there are a variety of other ways the framework can help production:

#### Automatic sprite sheets

Any images inside the sprites folder (dev/img/sprites) will get built out into one sprite sheet which will replace them in the same folder. Sass is then generated inside the sprite stylesheet (dev/style/global/sprites.scss) which can be used to add these as backgrounds. Checkout https://github.com/twolfson/gulp.spritesmith for more info.

#### Critical CSS

If you have this enabled in the optimisation tasks at the bottom of the Gulpfile it will add critical CSS to the top of each HTML page helping to prevent FOUC.

#### UNCSS

This will parse all of your HTML pages against your stylesheet and remove any unused CSS. It is a great way to cut down filesize however make sure you specify any classes to ignore such as those in your JS files which is won’t read.

#### Favicons

Use the &#39;gulp favicon&#39; task to automatically generate favicons and social icons from one image. This can be setup from the favicon.js task in the tasks folder.

#### Build to prod

When you run &#39;gulp prod&#39; or in fact many of the other major build tasks, everything will get compiled out to the prod folder. This reason this doesn’t happen on the fly as you are developing is because it takes a bit of time. As part of the build everything will be optimised to the best of standards, make sure to run the accessibility and page insight tasks to see how your site performs. 

#### Deploy

Use the &#39;gulp deploy&#39; task to build and then deploy your site using FTP. Copy ftp-security.json from the project root and move it one folder up so it doesn’t get committed with the rest of your files, make sure it doesn’t get copied anywhere visible! Add in the relevant user details to the JSON. The remote FTP folder is specified at the top of the gulpfile.

#### Offline

Personally I find myself sometimes working somewhere without internet connection, &#39;gulp offline&#39; is the same as &#39;gulp&#39; except it doesn’t do any requests to online services which would otherwise break the build.

#### Browser reports

There is functionality to print off all the CSS, HTML and JS lints to a webpage for ease of reading rather than from the console. However I have for the most part turned this functionality off as I found it more annoying than helpful. It is still in there if you want to use it, set the browserReports var in the gulpfile to true if you want to do so. 

#### SVGs

There is an inline SVG task which will inline all of your SVGs. This way they can be targeted through CSS and you don’t have to deal with loads of muddy code by inserting them yourself. To use this add a class .svg in your Pug to any SVG you want to inline.

## CouchCMS

Uncomment the couch task from the prod build at the bottom of the Gulpfile to enable the CouchCMS tasks to run such as conversion to PHP and renaming of assets.
This is not totally straightforward but I have written this handy guide to give you a headstart: http://alexplummer.com/article/tutorials/using-couch-cms-with-pug.html

### Phonegap Build

This is currently not in this version of the framework although I have implemented it before in the past. I will at some point add this in, prod me if you want it done faster!

### Adding more tasks

If you find there aren’t enough tasks already (seriously?!!) then feel free to add your own in the tasks folder. These can then be called like any other task from the builds at the bottom of the gulpfile.
