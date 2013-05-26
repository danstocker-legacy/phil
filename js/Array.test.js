/**
 * JavaScript 1.5 (ES3) compatibility tests.
 */
/*global troop, module, test, expect, ok, equal, notEqual, strictEqual, deepEqual, raises */
/*global phil */
(function () {
    module("Array");

    test("Array index by element", function () {
        equal(phil.Array.indexOf.call(['foo', 'bar', 3], 'bar'), 1, "Hit");
        equal(phil.Array.indexOf.call(['foo', 'bar', 3], 'baz'), -1, "No hit");
    });

    test("Array sort", function () {
        deepEqual(
            phil.Array.sort.call(['foo', 'bar', 'baz'], undefined),
            ['bar', 'baz', 'foo'],
            "Sorting w/ undefined comparator"
        );

        deepEqual(
            phil.Array.sort.call(['foo', 'bar', 'baz'], function (a, b) {
                return a < b ? 1 : a > b ? - 1 : 0;
            }),
            ['foo', 'baz', 'bar'],
            "Sorting w/ valid comparator"
        );
    });
}());
