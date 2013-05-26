/**
 * ECMAScript 3 (JavaScript 1.5) compatibility layer.
 */
/*global phil */
(function () {
    var hOP = Object.prototype.hasOwnProperty,
        iPE = Object.prototype.propertyIsEnumerable,
        isPrototypeOf = Object.prototype.isPrototypeOf;

    /**
     * @class phil.Object
     */
    phil.Object = {
        isPrototypeOf: function (obj) {
            if (this === obj) {
                return false;
            } else {
                // calling original isPrototypeOf
                return isPrototypeOf.call(this, obj);
            }
        },

        /**
         * Retrieves non-standard __proto__
         * @param obj
         * @return {*}
         */
        getProto: function (obj) {
            return obj.__proto__;
        },

        /**
         * Retrieves object prototype from constructor.
         * Assumes that constructor property is set on object.
         * @param {object} obj
         * @return {object}
         */
        getConstructorPrototype: function (obj) {
            return obj.constructor.prototype;
        },

        getOwnPropertyNames: function (obj) {
            var result = [],
                key;

            // enumerable properties
            for (key in obj) {
                if (hOP.call(obj, key)) {
                    result.push(key);
                }
            }

            // non-enumerables that should be enumerable
            if (hOP.call(obj, 'toString') && !iPE.call(obj, 'toString')) {
                result.push('toString');
            }

            return result;
        },

        getOwnPropertyDescriptor: function (obj, prop) {
            if (!hOP.call(obj, prop)) {
                return undefined;
            }

            // default property attributes
            var result = {
                    writable    : true,
                    enumerable  : true,
                    configurable: true
                },
                getter,
                setter;

            // looking up whether there is any getter / setter functionality
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
                // applying as value
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
                    Object.defineProperty(o, key, props[key]);
                }
            }

            return o;
        }
    };

    if (phil.hasCircularPrototypes()) {
        Object.prototype.isPrototypeOf = phil.Object.isPrototypeOf;
    }

    if (typeof Object.getPrototypeOf !== 'function') {
        Object.getPrototypeOf = phil.hasProto() ?
            phil.Object.getProto :
            phil.Object.getConstructorPrototype;
    }

    if (typeof Object.getOwnPropertyNames !== 'function') {
        Object.getOwnPropertyNames = phil.Object.getOwnPropertyNames;
    }

    if (typeof Object.keys !== 'function') {
        Object.keys = phil.Object.getOwnPropertyNames;
    }

    if (!phil.hasGetOwnPropertyDescriptor()) {
        Object.getOwnPropertyDescriptor = phil.Object.getOwnPropertyDescriptor;
    }

    if (!phil.hasDefineProperty()) {
        Object.defineProperty = phil.Object.defineProperty;
    }

    if (typeof Object.create !== 'function') {
        Object.create = phil.Object.create;
    }
}());
