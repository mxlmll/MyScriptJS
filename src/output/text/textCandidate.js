/**
 *
 * @param scope
 */
(function (scope) {

    /**
     *
     * @constructor
     */
    function TextCandidate () {
        this.label = null;
        this.normalizedScore = null;
        this.spellingDistortionRatio = null;
        this.children = [];
        this.flags = [];
    }

    /**
     *
     * @type {Object}
     */
    TextCandidate.prototype = Object.create(Object.prototype);

    /**
     *
     * @returns {string}
     */
    TextCandidate.prototype.getLabel = function () {
        return this.label;
    };

    /**
     *
     * @returns {number}
     */
    TextCandidate.prototype.getNormalizedScore = function () {
        return this.normalizedScore;
    };

    /**
     *
     * @returns {number}
     */
    TextCandidate.prototype.getResemblanceScore = function () {
        return this.resemblanceScore;
    };

    /**
     *
     * @returns {number}
     */
    TextCandidate.prototype.getSpellingDistortionRatio = function () {
        return this.spellingDistortionRatio;
    };

    /**
     *
     * @returns {Array}
     */
    TextCandidate.prototype.getChildren = function () {
        return this.children;
    };

    /**
     *
     * @returns {Array}
     */
    TextCandidate.prototype.getFlags = function () {
        return this.flags;
    };

    /**
     *
     * @type {TextCandidate}
     */
    scope.TextCandidate = TextCandidate;
})(MyScript);