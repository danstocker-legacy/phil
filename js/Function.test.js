/**
 * JavaScript 1.5 (ES3) compatibility tests.
 */
/*global troop, module, test, expect, ok, equal, notEqual, strictEqual, deepEqual, raises */
/*global phil */
(function () {
    module("Function");

    test("Function binding", function () {
        expect(6);

        function test(arg1, arg2) {
            equal(arg1, 'hello', "Argument 1 ok");
            equal(arg2, 'world', "Argument 2 ok");
            return this.foo;
        }

        equal(typeof test('hello', 'world'), 'undefined', "Foo not present on global scope");

        var bound = phil.Function.bind.call(test, {
            foo: "bar"
        }, 'hello');

        equal(bound('world'), "bar", "Function bound to context");
    });
}());
