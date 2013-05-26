/**
 * ECMAScript 3 (JavaScript 1.5) compatibility layer.
 */
/*global phil */
(function () {
    var substr = String.prototype.substr;

    /**
     * @class phil.String
     */
    phil.String = {
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

    if (!phil.canSubstrTakeNegativeIndex()) {
        String.prototype.substr = phil.String.substr;
    }
}());
