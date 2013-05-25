/**
 * JavaScript 1.5 (ES3) compatibility tests.
 */
/*global troop, module, test, expect, ok, equal, notEqual, strictEqual, deepEqual, raises */
/*global phil */
(function () {
    var polyfill = phil.polyfill;

    module("Polyfill");

    test("Basic", function () {
        if (phil.hasProto()) {
            equal(polyfill.getProto([]), Array.prototype, "Array prototype");
        } else {
            equal(polyfill.getConstructorPrototype([]), Array.prototype, "Array prototype");
        }

        var tmp = {foo: 'bar', hello: "world", toString: function () {}};

        ok(!polyfill.isPrototypeOf.call(tmp, Object.prototype), "Object is not prototype of Object.prototype");
        ok(!polyfill.isPrototypeOf.call(tmp, tmp), "Object is not prototype of itself");
        ok(polyfill.isPrototypeOf.call(Object.prototype, tmp), "Object.prototype is prototype of object");

        deepEqual(polyfill.getOwnPropertyNames(tmp).sort(), ['foo', 'hello', 'toString'], "Own property names");
        deepEqual(polyfill.getOwnPropertyNames(Array.prototype), [
            'toString'
        ], "Own property names of purely non-enumerable object");

        deepEqual(
            polyfill.getOwnPropertyDescriptor(tmp, 'foo'),
            {
                writable    : true,
                enumerable  : true,
                configurable: true,
                value       : 'bar'
            },
            "String property descriptor"
        );
    });

    test(".defineProperty", function () {
        var o = {},
            result,
            tmp;

        result = polyfill.defineProperty(o, 'p1', {value: 5});
        equal(result, o, "Returns host object");
        equal(o.p1, 5, "Value assignment");

        polyfill.defineProperty(o, 'p2', {get: function () {return (tmp || '') + 'foo';}});
        tmp = '';
        equal(o.p2, 'foo', "Getter 1");

        if (phil.hasGetterSetter()) {
            tmp = 'a';
            equal(o.p2, 'afoo', "Getter 2");

            polyfill.defineProperty(o, 'p3', {get: function () {return tmp;}, set: function (x) {tmp = x * 2;}});
            o.p3 = 3;

            equal(o.p3, 6, "Setter");

            polyfill.defineProperty(o, 'p4', {value: 'hello'});
            equal(o.p4, 'hello', "Property starts out as value");
            equal(typeof o.__lookupGetter__('p4'), 'undefined', "Value property has no getter");

            tmp = 'boo';
            polyfill.defineProperty(o, 'p4', {
                get: function () { return tmp;},
                set: function (x) { tmp = x;}
            });
            equal(typeof o.__lookupGetter__('p4'), 'function', "Property getter");
            equal(typeof o.__lookupSetter__('p4'), 'function', "Property setter");
            equal(o.p4, 'boo', "Property value provided by getter");

            polyfill.defineProperty(o, 'p4', {get: function () { return 'world';}});
            equal(typeof o.__lookupGetter__('p4'), 'function', "Property getter");
            equal(typeof o.__lookupSetter__('p4'), 'undefined', "No setter defined");
            equal(o.p4, 'world', "Property value provided by getter");
        }
    });

    test(".getOwnPropertyDescriptor", function () {
        var o = {};

        o.p1 = 'foo';
        deepEqual(
            polyfill.getOwnPropertyDescriptor(o, 'p1'),
            {
                writable    : true,
                enumerable  : true,
                configurable: true,
                value       : 'foo'
            },
            "Value-property descriptor OK"
        );

        function getter() {return 'foo';}

        if (phil.hasGetterSetter()) {
            o.__defineGetter__('p2', getter);
            deepEqual(
                polyfill.getOwnPropertyDescriptor(o, 'p2'),
                {
                    writable    : true,
                    enumerable  : true,
                    configurable: true,
                    get         : getter
                },
                "Getter-property descriptor OK"
            );
        }
    });

    test(".create", function () {
        var base = {},
            child1 = polyfill.create(base, {test: {value: 'tset'}});

        if (phil.hasProto()) {
            strictEqual(polyfill.getProto(child1), base, "Immediate prototype");
        } else {
            strictEqual(polyfill.getConstructorPrototype(child1), base, "Immediate prototype");
        }
        equal(child1.test, 'tset', "Applied property");
    });

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
