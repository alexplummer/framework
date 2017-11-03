
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


// Create component
// ============
// Creates a variety of favicons, setup first in 'tasks' folder

gulp.task('create-component', (cb) => {

    let newDirs = fs.readdirSync((paths.dev + '/components/'));
    let oldArray = Object.keys(oldDirs).map(function (key) { return oldDirs[key]; });
    let newArray = Object.keys(newDirs).map(function (key) { return newDirs[key]; });
    let dsIndex = newArray.indexOf('.DS_Store');
    
    if (dsIndex > -1) {
        newArray.splice(dsIndex, 1);
    }

    difference(newArray, oldArray);

    function difference(a1, a2) {
        let result = [];

        for (let i = 0; i < a1.length; i++) {
            if (a2.indexOf(a1[i]) === -1) {
                result.push(a1[i]);
            }
        }
        if (result.length > 0 
        && result !== 'untitled folder'
        && result !== 'New folder'
        ){
            console.log('New component created: ' + result);
            oldDirs = newDirs;
            createComponent(result);
        }
    }

    function createComponent(componentName) {

        componentName = componentName.toString();
        let properName = componentName.replace('-', ' ');
        properName = properName.charAt(0).toUpperCase() + properName.slice(1);

        if (componentName !== 'untitled folder' && componentName !== 'New folder') {

            let pugContents =
                `
//- ${properName}
//- ============
//- (Write description here)

//- Includes

mixin ${componentName}()
    
    .${componentName}
`;

            let sassContents =
                `
// ${properName}
// ============
// (Write description here)

.${componentName} {

}`;

    let jsContents =
                `
// ${properName}
// ============
// (Write description here)

// Imports
import { cl } from '../script/library/cl';

// Exports
export { exampleFunction };

// exampleFunction
const exampleFunction = function exampleFunction() {
    cl('${properName} exampleFunction loaded');
}`;

            fs.writeFile(paths.dev + '/components/' + componentName + '/_' + componentName + '.pug', pugContents);
            fs.writeFile(paths.dev + '/components/' + componentName + '/_' + componentName + '.scss', sassContents);
            fs.writeFile(paths.dev + '/components/' + componentName + '/' + componentName + '.js', jsContents);
        }
    }

    cb();
});
