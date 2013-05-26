/**
 * ECMAScript 3 (JavaScript 1.5) compatibility layer.
 */
/*global phil */
(function () {
    var sort = Array.prototype.sort;

    /**
     * @class phil.Array
     */
    phil.Array = {
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

    if (typeof Array.prototype.indexOf !== 'function') {
        Array.prototype.indexOf = phil.Array.arrayIndexOf;
    }

    if (!phil.canSortTakeUndefinedHandler()) {
        Array.prototype.sort = phil.Array.arraySort;
    }
}());
