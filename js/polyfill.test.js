/**
 * JavaScript 1.5 (ES3) compatibility tests.
 */
/*global troop, module, test, expect, ok, equal, notEqual, strictEqual, deepEqual, raises */
/*global phil */
(function () {
    var polyfill = phil.polyfill;

    module("Polyfill");

    test("Substring extraction", function () {
        equal(polyfill.substr.call("hello", 1, 2), "el", "Non-negative start index");
        equal(polyfill.substr.call("hello", -2), "lo", "Negative start index");
        equal(polyfill.substr.call("hello", -2, 1), "l", "Negative start index with length");
    });
}());
