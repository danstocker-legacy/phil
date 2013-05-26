/**
 * ECMAScript 3 (JavaScript 1.5) compatibility layer.
 */
/*global phil */
(function () {
    var substr = String.prototype.substr,
        sort = Array.prototype.sort,
        self;

    self = phil.polyfill = {
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
        },

        /**
         *
         * @param {number} start
         * @param {number} length
         * @return {string}
         */
        substr: function (start, length) {
            var strLen;
            if (start < 0) {
                strLen = this.length;
                return substr.call(this, strLen + start, length || (0 - start));
            } else {
                return substr.call(this, start, length);
            }
        },

        /**
         *
         * @param {*} elem
         * @return {Number}
         */
        arrayIndexOf: function (elem) {
            var i;
            for (i = 0; i < this.length; i++) {
                if (this[i] === elem) {
                    return i;
                }
            }
            return -1;
        },

        /**
         *
         * @param {function} comparator
         * @return {Array}
         */
        arraySort: function (comparator) {
            if (typeof comparator !== 'undefined') {
                return sort.call(this, comparator);
            } else {
                return sort.call(this);
            }
        }
    };

    if (typeof Function.prototype.bind !== 'function') {
        Function.prototype.bind = self.functionBind;
    }

    if (!phil.hasNegativeSubstr()) {
        String.prototype.substr = self.substr;
    }

    if (typeof Array.prototype.indexOf !== 'function') {
        Array.prototype.indexOf = self.arrayIndexOf;
    }

    if (!phil.canArraySortTakeUndefined()) {
        Array.prototype.sort = self.arraySort;
    }
}());
