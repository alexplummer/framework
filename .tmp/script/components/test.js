

/* inject:imports */
/* endinject */

var app = app || {};

MYAPP.math_stuff = {

    sum: function (a, b) {
        return a + b;
    },

    multi: function (a, b) {
        return a * b;
    }
};

MYAPP.Person = function (first, last) {

    this.first_name = first;
    this.last_name = last;
};

MYAPP.Person.prototype.getName = function () {
    return this.first_name + ' ' + this.last_name;
};