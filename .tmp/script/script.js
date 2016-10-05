var test2ss;
var app = app || {};

app.math_stuff = {


};

app.Person = function (first, last) {

    this.first_name = first;
    this.last_name = last;
};

app.Person.prototype.getName = function () {
    return this.first_name + ' ' + this.last_name;
};
