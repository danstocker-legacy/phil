/**
 * JavaScript 1.5 (ES3) compatibility tests.
 */
/*global troop, module, test, expect, ok, equal, notEqual, strictEqual, deepEqual, raises */
/*global phil */
(function () {
    var polyfill = phil.polyfill;

    module("Polyfill");

    test("Function binding", function () {
        expect(6);

        function test(arg1, arg2) {
            equal(arg1, 'hello', "Argument 1 ok");
            equal(arg2, 'world', "Argument 2 ok");
            return this.foo;
        }

        equal(typeof test('hello', 'world'), 'undefined', "Foo not present on global scope");

        var bound = polyfill.functionBind.call(test, {
            foo: "bar"
        }, 'hello');

        equal(bound('world'), "bar", "Function bound to context");
    });

    test("Substring extraction", function () {
        equal(polyfill.substr.call("hello", 1, 2), "el", "Non-negative start index");
        equal(polyfill.substr.call("hello", -2), "lo", "Negative start index");
        equal(polyfill.substr.call("hello", -2, 1), "l", "Negative start index with length");
    });
}());
