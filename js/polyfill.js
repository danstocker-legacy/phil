/**
 * ECMAScript 3 (JavaScript 1.5) compatibility layer.
 */
/*global phil */
(function () {
    var hOP = Object.prototype.hasOwnProperty,
        isPrototypeOf = Object.prototype.isPrototypeOf,
        self;

    self = phil.polyfill = {
        isPrototypeOf: function (obj) {
            if (this === obj) {
                return false;
            } else {
                // calling original isPrototypeOf
                return isPrototypeOf.call(this, obj);
            }
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

            if (phil.hasLookupGetterSetter()) {
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
            } else if (phil.hasGetterSetter()) {
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

            if (!phil.hasProto()) {
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

    if (phil.hasCircularPrototypes()) {
        Object.prototype.isPrototypeOf = self.isPrototypeOf;
    }

    if (typeof Object.getPrototypeOf !== 'function') {
        Object.getPrototypeOf = phil.hasProto() ?
            self.getProto :
            self.getConstructorPrototype;
    }

    if (typeof Object.getOwnPropertyNames !== 'function') {
        Object.getOwnPropertyNames = self.getOwnPropertyNames;
    }

    if (typeof Object.keys !== 'function') {
        Object.keys = self.getOwnPropertyNames;
    }

    if (!phil.hasGetOwnPropertyDescriptor()) {
        Object.getOwnPropertyDescriptor = self.getOwnPropertyDescriptor;
    }

    if (!phil.hasDefineProperty()) {
        Object.defineProperty = self.defineProperty;
    }

    if (typeof Object.create !== 'function') {
        Object.create = self.create;
    }

    if (typeof Function.prototype.bind !== 'function') {
        Function.prototype.bind = self.functionBind;
    }
}());
