(function (scope) {

    /**
     * Represent the Math Renderer. It's used to calculate the math ink rendering in HTML5 canvas
     *
     * @class MathRenderer
     * @extends AbstractRenderer
     * @constructor
     */
    function MathRenderer() {
        this.cloneStrokes = [];
        this.strokesToRemove = [];
    }

    /**
     * Inheritance property
     */
    MathRenderer.prototype = new scope.AbstractRenderer();

    /**
     * Constructor property
     */
    MathRenderer.prototype.constructor = MathRenderer;

    /**
     * Draw math strokes on HTML5 canvas. Scratch out results are use to redraw HTML5 Canvas
     *
     * @method drawStrokesByRecognitionResult
     * @param {Stroke[]} strokes
     * @param {MathDocument} recognitionResult
     * @param {RenderingParameters} parameters
     * @param {Object} context
     */
    MathRenderer.prototype.drawStrokesByRecognitionResult = function (strokes, recognitionResult, parameters, context) {
        var notScratchOutStrokes = this.removeScratchOutStrokes(strokes, recognitionResult.getScratchOutResults());

        for (var i in notScratchOutStrokes) {
            var stroke = notScratchOutStrokes[i];
            this.drawStroke(stroke, parameters, context);
            if (parameters.getShowBoundingBoxes()) {
                // Draw input Ink global bounding box
                this.drawBoundingBox(stroke.getBoundingBox(), context);
            }
        }

        if (parameters.getShowBoundingBoxes()) {
            // Draw input Ink global bounding box
            this.drawBoundingBox(this.getGlobalBoundingBoxByStrokes(notScratchOutStrokes), context);
        }
    };

    /**
     * Remove scratch out from input strokes
     *
     * @param {Stroke[]} strokes
     * @param {MusicScratchOut[]} scratchOutResults
     * @returns {Stroke[]} notScratchOutStrokes
     */
    MathRenderer.prototype.removeScratchOutStrokes = function (strokes, scratchOutResults) {
        if (!scratchOutResults || scratchOutResults.length === 0) {
            return strokes;
        }

        var cloneStrokes = strokes.slice(0);
        var strokesToRemove = [];

        for (var k in scratchOutResults) {
            if (scratchOutResults[k].getErasedInkRanges()) {
                for (var n in scratchOutResults[k].getErasedInkRanges()) {
                    strokesToRemove.push(scratchOutResults[k].getErasedInkRanges()[n].getComponent());
                }
                for (var p in scratchOutResults[k].getInkRanges()) {
                    strokesToRemove.push(scratchOutResults[k].getInkRanges()[p].getComponent());
                }
            }
        }

        strokesToRemove.sort(function (a, b) {
            return b - a;
        });

        for (var z in strokesToRemove) {
            cloneStrokes.splice(strokesToRemove[z], 1);
        }
        return cloneStrokes;
    };

    // Export
    scope.MathRenderer = MathRenderer;
})(MyScript);