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
         * @param {*} elem
         * @return {Number}
         */
        indexOf: function (elem, from) {
            var i;
            for (i = from || 0; i < this.length; i++) {
                if (this[i] === elem) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * @param {function} comparator
         * @return {Array}
         */
        sort: function (comparator) {
            if (typeof comparator !== 'undefined') {
                return sort.call(this, comparator);
            } else {
                return sort.call(this);
            }
        }
    };

    if (typeof Array.prototype.indexOf !== 'function') {
        Array.prototype.indexOf = phil.Array.indexOf;
    }

    if (!phil.canSortTakeUndefinedHandler()) {
        Array.prototype.sort = phil.Array.sort;
    }
}());
