'use strict';

var app = function () {
    'use strict';

    // Module JS

    var cl = function cl(content) {
        console.log(content);
    };

    // Module JS
    var onReady = function onReady(method) {

        var readyStateCheckInterval = setInterval(function () {
            if (document && document.readyState === 'complete') {
                // or 'interactive'
                clearInterval(readyStateCheckInterval);
                method();
            }
        }, 10);
    };

    // Module JS
    var hasClass = function hasClass(el, theClass) {
        var theSelector = void 0;

        // Decide what type of selector it is 
        if (document.getElementsByTagName(el)[0]) {
            theSelector = document.getElementsByTagName(el)[0];
        } else if (document.querySelector(el)) {
            theSelector = document.querySelector(el);
        }

        // Check to see if it contains the class
        if (theSelector.classList.contains(theClass)) {
            return true;
        }
        return false;
    };

    // Content right
    // ============
    // (Write description here)

    // Imports
    // animateHeader
    var animateHeader = function animateHeader() {

        document.querySelector('h1').classList.add('swing');
    };

    // App
    // ============
    // All of JS is organised from here

    // Imports
    // Global object
    var globals = globals || { 'test': true };

    onReady(function () {

        // Global fns
        cl('Page ready');

        // Home specific fns
        if (hasClass('body', 'home')) {
            animateHeader();
        }
    });

    return globals;
}();
//# sourceMappingURL=app.js.map
