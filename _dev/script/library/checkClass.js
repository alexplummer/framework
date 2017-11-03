
// Has Class
// ============
// Check if el has a class attached

// Exports
export { hasClass };

// Module JS
const hasClass = function hasClass(el, theClass) {
    let theSelector;

    // Decide what type of selector it is 
    if (document.getElementsByTagName(el)[0]) {
        theSelector = document.getElementsByTagName(el)[0];
    }
    else if (document.querySelector(el)) {
        theSelector = document.querySelector(el);
    }
    
    // Check to see if it contains the class
    if (theSelector.classList.contains(theClass)) {
        return true;
    }
    return false;
}