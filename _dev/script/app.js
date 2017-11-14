
// App
// ============
// All of JS is organised from here

// Imports
import { cl } from 'library/cl';
import { onReady } from 'library/onReady';
import { hasClass } from 'library/checkClass';
//import { animateHeader } from '../components/content-right/content-right';

// Exports
export default globals;

// Global object
let globals = globals || {};

// Run App fns on ready
onReady(() => {

    // Global fns

    // Home specific fns
    if (hasClass('body', 'home')) {   
        //animateHeader();
    }
});