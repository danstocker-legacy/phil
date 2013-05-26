/**
 * ECMAScript 3 (JavaScript 1.5) compatibility layer.
 */
/*global phil */
(function () {
    var substr = String.prototype.substr,
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
        }
    };

    if (typeof Function.prototype.bind !== 'function') {
        Function.prototype.bind = self.functionBind;
    }

    if (!phil.hasNegativeSubstr()) {
        String.prototype.substr = self.substr;
    }
}());
