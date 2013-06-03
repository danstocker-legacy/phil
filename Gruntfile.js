/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespace.js',
            'js/features.js',
            'js/Object.js',
            'js/Array.js',
            'js/Function.js',
            'js/String.js'
        ],

        test: [
            'js/jsTestDriver.conf'
        ],

        globals: {}
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
