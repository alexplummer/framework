
// App
// ============
// All of JS is organised from here

// Imports
import { cl } from 'library/cl';
import { onReady } from 'library/onReady';
import { hasClass } from 'library/checkClass';
import { animateHeader } from '../components/content-right/content-right';

// Global object
let globals = globals || {'test':true};

onReady(() => {

    // Global fns
    cl('Page ready');

    // Home specific fns
    if (hasClass('body', 'home')) {   
        animateHeader();
    }
});

// Exports
export default globals;