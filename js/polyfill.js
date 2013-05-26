/**
 * ECMAScript 3 (JavaScript 1.5) compatibility layer.
 */
/*global phil */
(function () {
    var substr = String.prototype.substr,
        self;

    self = phil.polyfill = {
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

    if (!phil.hasNegativeSubstr()) {
        String.prototype.substr = self.substr;
    }
}());
