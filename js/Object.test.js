/*global troop, module, test, expect, ok, equal, notEqual, strictEqual, deepEqual, raises */
/*global phil */
(function () {
    module("Object");

    test("Basic", function () {
        if (phil.hasProto()) {
            equal(phil.Object.getProto([]), Array.prototype, "Array prototype");
        } else {
            equal(phil.Object.getConstructorPrototype([]), Array.prototype, "Array prototype");
        }

        var tmp = {foo: 'bar', hello: "world", toString: function () {}};

        ok(!phil.Object.isPrototypeOf.call(tmp, Object.prototype), "Object is not prototype of Object.prototype");
        ok(!phil.Object.isPrototypeOf.call(tmp, tmp), "Object is not prototype of itself");
        ok(phil.Object.isPrototypeOf.call(Object.prototype, tmp), "Object.prototype is prototype of object");

        deepEqual(phil.Object.getOwnPropertyNames(tmp).sort(), ['foo', 'hello', 'toString'], "Own property names");

        deepEqual(
            phil.Object.getOwnPropertyDescriptor(tmp, 'foo'),
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

        result = phil.Object.defineProperty(o, 'p1', {value: 5});
        equal(result, o, "Returns host object");
        equal(o.p1, 5, "Value assignment");

        phil.Object.defineProperty(o, 'p2', {get: function () {return (tmp || '') + 'foo';}});
        tmp = '';
        equal(o.p2, 'foo', "Getter 1");

        if (phil.hasGetterSetter()) {
            tmp = 'a';
            equal(o.p2, 'afoo', "Getter 2");

            phil.Object.defineProperty(o, 'p3', {get: function () {return tmp;}, set: function (x) {tmp = x * 2;}});
            o.p3 = 3;

            equal(o.p3, 6, "Setter");

            phil.Object.defineProperty(o, 'p4', {value: 'hello'});
            equal(o.p4, 'hello', "Property starts out as value");
            equal(typeof o.__lookupGetter__('p4'), 'undefined', "Value property has no getter");

            tmp = 'boo';
            phil.Object.defineProperty(o, 'p4', {
                get: function () { return tmp;},
                set: function (x) { tmp = x;}
            });
            equal(typeof o.__lookupGetter__('p4'), 'function', "Property getter");
            equal(typeof o.__lookupSetter__('p4'), 'function', "Property setter");
            equal(o.p4, 'boo', "Property value provided by getter");

            phil.Object.defineProperty(o, 'p4', {get: function () { return 'world';}});
            equal(typeof o.__lookupGetter__('p4'), 'function', "Property getter");
            equal(typeof o.__lookupSetter__('p4'), 'undefined', "No setter defined");
            equal(o.p4, 'world', "Property value provided by getter");
        }
    });

    test(".getOwnPropertyDescriptor", function () {
        var o = {};

        o.p1 = 'foo';
        deepEqual(
            phil.Object.getOwnPropertyDescriptor(o, 'p1'),
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
                phil.Object.getOwnPropertyDescriptor(o, 'p2'),
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
            child1 = phil.Object.create(base, {test: {value: 'tset'}});

        if (phil.hasProto()) {
            strictEqual(phil.Object.getProto(child1), base, "Immediate prototype");
        } else {
            strictEqual(phil.Object.getConstructorPrototype(child1), base, "Immediate prototype");
        }
        equal(child1.test, 'tset', "Applied property");
    });
}());
