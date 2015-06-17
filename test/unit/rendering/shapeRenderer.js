'use strict';

describe('ShapeRenderer: rendering/shapeRenderer.js', function () {

    describe('Default construction', function () {

        var shapeRenderer;
        before(function (done) {
            shapeRenderer = new MyScript.ShapeRenderer();
            done();
        });

        it('Check initial state', function () {
            expect(shapeRenderer).to.be.an('object');
            expect(shapeRenderer).to.be.an.instanceOf(MyScript.AbstractRenderer);
            expect(shapeRenderer).to.be.an.instanceOf(MyScript.ShapeRenderer);
        });

    });

    describe('Workflow', function () {

        var shapeRenderer, context;
        before(function (done) {
            context = document.createElement('canvas').getContext('2d');
            shapeRenderer = new MyScript.ShapeRenderer();
            done();
        });

        it('Clear context', function () {
            expect(function () {
                shapeRenderer.clear(context);
            }).to.not.throw(Error);
        });

        it('Draw stroke', function () {
            expect(function () {
                shapeRenderer.drawComponents([new MyScript.Stroke()], context);
            }).to.not.throw(Error);
            expect(function () {
                shapeRenderer.drawComponents([new MyScript.Stroke()], context, shapeRenderer.getParameters());
            }).to.not.throw(Error);
        });

        it('Draw ellipse', function () {
            var shapeEllipse = new MyScript.ShapeEllipse({
                beginDecoration: 'ARROW_HEAD',
                beginTangentAngle: 0.8050692,
                center: {x: 484.5391, y: 267.50476},
                endDecoration: 'ARROW_HEAD',
                endTangentAngle: 0.8039634,
                maxRadius: 230.76974,
                minRadius: 122.8728,
                orientation: -0.056189466,
                startAngle: 2.9027889,
                sweepAngle: 3.1410782});
            expect(function () {
                shapeRenderer.drawComponents([shapeEllipse], context);
            }).to.not.throw(Error);
            expect(function () {
                shapeRenderer.drawComponents([shapeEllipse], context, shapeRenderer.getParameters());
            }).to.not.throw(Error);
        });

        it('Draw shape line', function () {
            var shapeLine = new MyScript.ShapeLine({
                firstPoint: {x:1, y: 2},
                lastPoint: {x:3, y: 4},
                beginDecoration: 'ARROW_HEAD',
                beginTangentAngle: 3.1415927,
                endDecoration: 'ARROW_HEAD',
                endTangentAngle: 0});
            expect(function () {
                shapeRenderer.drawComponents([shapeLine], context);
            }).to.not.throw(Error);
            expect(function () {
                shapeRenderer.drawComponents([shapeLine], context, shapeRenderer.getParameters());
            }).to.not.throw(Error);
        });

        it('Draw unknown component', function () {
            expect(function () {
                shapeRenderer.drawComponents([{test: 'test'}], context);
            }).to.throw(Error);
            expect(function () {
                shapeRenderer.drawComponents([{test: 'test'}], context, shapeRenderer.getParameters());
            }).to.throw(Error);
        });

        it('Draw unknown shape primitive', function () {
            expect(function () {
                shapeRenderer.drawShapePrimitive({test: 'test'}, context);
            }).to.throw(Error);
            expect(function () {
                shapeRenderer.drawShapePrimitive({test: 'test'}, context, shapeRenderer.getParameters());
            }).to.throw(Error);
        });

        it('Draw shapes', function () {
            var shapes = [
                new MyScript.ShapeSegment({
                    candidates: [new MyScript.ShapeRecognized()],
                    selectedCandidateIndex: 0
                }),
                new MyScript.ShapeSegment({
                    candidates: [new MyScript.ShapeNotRecognized()],
                    selectedCandidateIndex: 0
                }),
                new MyScript.ShapeSegment({
                    candidates: [{test: 'test'}],
                    selectedCandidateIndex: 0
                })];
            expect(function () {
                shapeRenderer.drawShapes([], shapes, context);
            }).to.not.throw(Error);
            expect(function () {
                shapeRenderer.drawShapes([], shapes, context, shapeRenderer.getParameters());
            }).to.not.throw(Error);
        });

        it('Draw shape recognized', function () {
            expect(function () {
                shapeRenderer.drawShapeRecognized(new MyScript.ShapeRecognized(), context);
            }).to.not.throw(Error);
            expect(function () {
                shapeRenderer.drawShapeRecognized(new MyScript.ShapeRecognized(), context, shapeRenderer.getParameters());
            }).to.not.throw(Error);
        });

        it('Draw shape not recognized', function () {
            expect(function () {
                shapeRenderer.drawShapeNotRecognized([], [], context);
            }).to.not.throw(Error);
            expect(function () {
                shapeRenderer.drawShapeNotRecognized([], [], context, shapeRenderer.getParameters());
            }).to.not.throw(Error);
        });

        it('Draw recognition result', function () {
            expect(function () {
                shapeRenderer.drawRecognitionResult([], new MyScript.ShapeDocument(), context);
            }).to.not.throw(Error);
            expect(function () {
                shapeRenderer.drawRecognitionResult([], new MyScript.ShapeDocument(), context, shapeRenderer.getParameters());
            }).to.not.throw(Error);
        });

    });

});