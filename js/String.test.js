/**
 * JavaScript 1.5 (ES3) compatibility tests.
 */
/*global troop, module, test, expect, ok, equal, notEqual, strictEqual, deepEqual, raises */
/*global phil */
(function () {
    module("String");

    test("Substring extraction", function () {
        equal(phil.String.substr.call("hello", 1, 2), "el", "Non-negative start index");
        equal(phil.String.substr.call("hello", -2), "lo", "Negative start index");
        equal(phil.String.substr.call("hello", -2, 1), "l", "Negative start index with length");
    });
}());
