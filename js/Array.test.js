/**
 * JavaScript 1.5 (ES3) compatibility tests.
 */
/*global troop, module, test, expect, ok, equal, notEqual, strictEqual, deepEqual, raises */
/*global phil */
(function () {
    module("Polyfill");

    test("Array index by element", function () {
        equal(phil.Array.arrayIndexOf.call(['foo', 'bar', 3], 'bar'), 1, "Hit");
        equal(phil.Array.arrayIndexOf.call(['foo', 'bar', 3], 'baz'), -1, "No hit");
    });
}());
