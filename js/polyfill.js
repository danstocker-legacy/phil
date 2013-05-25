/**
 * ECMAScript 3 (JavaScript 1.5) compatibility layer.
 */
/*global phil */
(function () {
    var hOP = Object.prototype.hasOwnProperty,
        self;

    self = phil.polyfill = {
        /**
         * Determines whether direct access to prototype object is implemented
         * @return {Boolean}
         */
        hasProto: function () {
            return typeof Object.__proto__ !== 'undefined';
        },

        /**
         * Determines whether getters are implemented
         * @return {Boolean}
         */
        hasGetterSetter: function () {
            return typeof Object.__defineGetter__ !== 'undefined';
        },

        /**
         * Determines whether lookups are implemented
         * @return {Boolean}
         */
        hasLookupGetterSetter: function () {
            return typeof Object.__lookupGetter__ !== 'undefined';
        },

        getProto: function (obj) {
            return obj.__proto__;
        },

        getConstructorPrototype: function (obj) {
            return obj.constructor.prototype;
        },

        getOwnPropertyNames: function (obj) {
            var result = [],
                key;
            for (key in obj) {
                if (hOP.call(obj, key)) {
                    result.push(key);
                }
            }
            return result;
        },

        getOwnPropertyDescriptor: function (obj, prop) {
            if (!hOP.call(obj, prop)) {
                return undefined;
            }

            // basic properties
            var result = {
                    writable    : true,
                    enumerable  : true,
                    configurable: true
                },
                getter,
                setter;

            if (self.hasLookupGetterSetter()) {
                getter = obj.__lookupGetter__(prop);
                setter = obj.__lookupSetter__(prop);
            }

            if (getter || setter) {
                // applying accessors when property is getter/setter
                if (getter) {
                    result.get = getter;
                }
                if (setter) {
                    result.set = setter;
                }
            } else {
                // applying value
                result.value = obj[prop];
            }

            return result;
        },

        defineProperty: function (obj, prop, desc) {
            // cleaning up
            delete obj[prop];

            if (hOP.call(desc, 'value')) {
                // value assignment
                obj[prop] = desc.value;
            } else if (self.hasGetterSetter()) {
                // getter/setter
                if (typeof desc.get === 'function') {
                    obj.__defineGetter__(prop, desc.get);
                }
                if (typeof desc.set === 'function') {
                    obj.__defineSetter__(prop, desc.set);
                }
            } else if (typeof desc.get === 'function') {
                // assigning getter result as value
                obj[prop] = desc.get();
            }

            return obj;
        },

        /**
         * @param {object} proto
         * @param {object} [props]
         */
        create: function (proto, props) {
            function F() {}

            F.prototype = proto;

            var o = new F(),
                key;

            if (!self.hasProto()) {
                o.constructor = F;
            }

            for (key in props) {
                if (hOP.call(props, key)) {
                    self.defineProperty(o, key, props[key]);
                }
            }

            return o;
        },

        /**
         * Function.prototype.bind
         * It's a very crude approximation as compared to:
         * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
         * @param {Object} that Externally supplied context
         * @return {function} Function with the supplied context tied to it.
         */
        functionBind: function (that) {
            var fn = this, // function to be bound
                slice = Array.prototype.slice,
                args = slice.call(arguments, 1);

            return function () {
                return fn.apply(that, args.concat(slice.call(arguments)));
            };
        }
    };

    if (typeof Object.getPrototypeOf !== 'function') {
        Object.getPrototypeOf = self.hasProto() ?
            self.getProto :
            self.getConstructorPrototype;
    }

    if (typeof Object.getOwnPropertyNames !== 'function') {
        Object.getOwnPropertyNames = self.getOwnPropertyNames;
    }

    if (typeof Object.keys !== 'function') {
        Object.keys = self.getOwnPropertyNames;
    }

    if (typeof Object.getOwnPropertyDescriptor !== 'function') {
        Object.getOwnPropertyDescriptor = self.getOwnPropertyDescriptor;
    }

    if (typeof Object.defineProperty !== 'function') {
        Object.defineProperty = self.defineProperty;
    }

    if (typeof Object.create !== 'function') {
        Object.create = self.create;
    }

    if (typeof Function.prototype.bind !== 'function') {
        Function.prototype.bind = self.functionBind;
    }
}());
