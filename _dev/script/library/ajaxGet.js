
// ajaxGet
// ============
// Makes an ajax request

// Format:
// ajaxGet(url, callback);

// Imports
import { cl } from 'cl';

// Exports
export { ajaxGet };

// Module JS
const ajaxGet = function ajaxGet(url, callback) {

    let request = new XMLHttpRequest();

    request.open('GET', url, true);

    request.onload = function () {

        if (this.status >= 200 && this.status < 400) {
            callback(this.response);
        } 
        else {
            cl('ajaxGet failed');
        }
    };
    request.onerror = function () {
        cl('ajaxGet failed to connect');
    };

    request.send();
}