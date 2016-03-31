"use strict";

var React = require('react');
var UtilMixin = require('./mixins/utils.js');
var If = require('./If.jsx');
var _ = require('lodash');
var Math = require('mathjs');

var KEYUP = 38;
var KEYDOWN = 40;
var KEYENTER = 13;

var intervalCb = null;
module.exports = React.createClass({
    mixins: [UtilMixin()],

    defaultStates: function () {
        return {
            multiplier: 2,
            points: 300,
            xRadius: 1,
            yRadius: 1,
            xBounds: [-1, 1],
            yBounds: [-1, 1],
            xEquation: 'xRadius * Math.cos(2 * Math.PI * i / points)',
            yEquation: 'yRadius * Math.sin(2 * Math.PI * i / points)',
            xDisplay: 'xRadius * Math.cos(2 * Math.PI * i / points)',
            yDisplay: 'yRadius * Math.sin(2 * Math.PI * i / points)',
            loopTime: 0,
            showAdvance: false
        };
    },

    getInitialState: function () {
        return this.defaultStates();
    },

    createCoordinates: function (points, xRadius, yRadius, xEquation, yEquation) {
        var coordinates = [];
        for (var i = 0; i < points; i++) {
            //try {
            var x = eval(xEquation);
            var y = eval(yEquation);
            //} catch (e) {
            //    var x = xRadius * Math.cos(2 * Math.PI * i / points);
            //    var y = yRadius * Math.sin(2 * Math.PI * i / points);
            // }
            coordinates.push({x: x, y: y});
        }

        return coordinates;
    },

    plot: function (points, multiplier, xRadius, yRadius, xBounds, yBounds, xEquation, yEquation) {
        points = points || this.state.points;
        multiplier = multiplier || this.state.multiplier;
        xRadius = xRadius || this.state.xRadius;
        yRadius = yRadius || this.state.yRadius;
        xBounds = xBounds || this.state.xBounds;
        yBounds = yBounds || this.state.yBounds;
        xEquation = xEquation || this.state.xEquation;
        yEquation = yEquation || this.state.yEquation;

        var coordinates = this.createCoordinates(points, xRadius, yRadius, xEquation, yEquation);
        var series = [];
        for (var i = 0; i < points; i++) {
            var line = [];
            line.push({
                x: coordinates[i].x,
                y: coordinates[i].y
            });
            var nextI = i * multiplier % points;
            line.push({
                x: coordinates[nextI].x,
                y: coordinates[nextI].y
            });
            series.push(line);
        }

        var x = new Chartist.Line('.ct-chart', {
            series: series
        }, {
            fullWidth: true,
            chartPadding: {
                right: 40
            },
            showLine: true,
            axisX: {
                type: Chartist.AutoScaleAxis,
                onlyInteger: true,
                high: xBounds[1],
                low: xBounds[0],
                divisor: 4,
                ticks: xBounds
            },
            axisY: {
                type: Chartist.AutoScaleAxis,
                onlyInteger: true,
                high: yBounds[1],
                low: yBounds[0],
                divisor: 4,
                ticks: yBounds
            }
        });
    },

    componentStatesWillUpdate: function (nextStates) {
        var points = nextStates.points || this.state.points;
        var multiplier = nextStates.multiplier || this.state.multiplier;
        var xRadius = nextStates.xRadius || this.state.xRadius;
        var yRadius = nextStates.yRadius || this.state.yRadius;
        var xBounds = nextStates.xBounds || this.state.xBounds;
        var yBounds = nextStates.yBounds || this.state.yBounds;
        var xEquation = nextStates.xEquation || this.state.xEquation;
        var yEquation = nextStates.yEquation || this.state.yEquation;

        if ("loopTime" in nextStates) {
            if (intervalCb) {
                clearInterval(intervalCb);
                intervalCb = null;
            }

            if (nextStates.loopTime !== 0) {
                intervalCb = setInterval(function () {
                    this.increment('multiplier');
                }.bind(this), nextStates.loopTime);
            }
        } else {
            this.plot(points, multiplier, xRadius, yRadius, xBounds, yBounds, xEquation, yEquation);
        }
    },

    componentDidMount: function () {
        this.plot();
        var self = this;
        $('#timeloop').slider({
            formatter: function (value) {
                self.safeSetState({loopTime: value});
                return 'Loop Interval: ' + value;
            }
        });
    },

    updateNumPoints: function (event) {
        if (event.keyCode === KEYUP) {
            this.increment('points', 1);
            event.preventDefault();
        } else if (event.keyCode === KEYDOWN) {
            this.decrement('points', 1, {min: 2});
            event.preventDefault();
        }
    },
    updateMultiplier: function (event) {
        if (event.keyCode === KEYUP) {
            this.increment('multiplier', 1);
            event.preventDefault();
        } else if (event.keyCode === KEYDOWN) {
            this.decrement('multiplier', 1, {min: 2});
            event.preventDefault();
        }
    },

    shouldXUpdate: function (event) {
        if (event.keyCode === KEYENTER) {
            this.safeSetState({xEquation: this.state.xDisplay});
        }
    },

    shouldYUpdate: function (event) {
        if (event.keyCode === KEYENTER) {
            this.safeSetState({yEquation: this.state.yDisplay});
        }
    },

    render: function () {
        var toggleText = 'Details';
        if (this.state.showAdvance) {
            toggleText = 'Hide';
        }

        return (
            <section id="services">
                <div className="container">

                    <div className="box first">
                        <div className="row">
                            <form className="form-horizontal">
                                <div className="row">
                                    <div className="col-sm-offset-1 col-sm-2">
                                        <div className="form-group">
                                            <label className="col-sm-6 control-label text-left-forced">
                                                Points:
                                            </label>
                                            <div className="col-sm-6">
                                                <input type="text"
                                                       onKeyDown={(event) => this.updateNumPoints(event)}
                                                       className="form-control"
                                                       value={this.state.points}
                                                       onChange={(event) => this.safeSetState({points: event.target.value}) }/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <label className="col-sm-6 control-label text-left-forced">
                                                Multiplier:
                                            </label>
                                            <div className="col-sm-6">
                                                <input type="text"
                                                       onKeyDown={(event) => this.updateMultiplier(event)}
                                                       className="form-control"
                                                       value={this.state.multiplier}
                                                       onChange={(event) => this.safeSetState({multiplier: event.target.value}) }/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-5">
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label text-left-forced">
                                                Timeloop:
                                            </label>
                                            <div className="col-sm-9">
                                                <input id="timeloop"
                                                       data-slider-id='timeloopSlider'
                                                       type="text"
                                                       data-slider-min="0"
                                                       data-slider-max="2000"
                                                       data-slider-step="100"
                                                       data-slider-value="0"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-1 text-right">
                                        <a
                                            className="btn btn-info"
                                            onClick={() => this.safeSetState({showAdvance: !this.state.showAdvance})}>
                                            {toggleText}
                                        </a>
                                    </div>
                                </div>

                                <If condition={this.state.showAdvance}>
                                    <div>
                                        <div className="row">
                                            <div className="col-sm-offset-2 col-sm-2">
                                                <div className="form-group">
                                                    <label className="col-sm-6 control-label text-left-forced">
                                                        XRadius:
                                                    </label>
                                                    <div className="col-sm-6">
                                                        <input type="text"
                                                               className="form-control"
                                                               value={this.state.xRadius}
                                                               onChange={(event) => this.safeSetState({xRadius: event.target.value}) }/>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-2">
                                                <div className="form-group">
                                                    <label className="col-sm-6 control-label text-left-forced">
                                                        YRadius:
                                                    </label>
                                                    <div className="col-sm-6">
                                                        <input type="text"
                                                               className="form-control"
                                                               value={this.state.yRadius}
                                                               onChange={(event) => this.safeSetState({yRadius: event.target.value}) }/>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-2">
                                                <div className="form-group">
                                                    <label className="col-sm-6 control-label text-left-forced">
                                                        xBounds:
                                                    </label>
                                                    <div className="col-sm-6">
                                                        <input type="text"
                                                               className="form-control"
                                                               value={this.state.xBounds}
                                                               onChange={(event) => this.safeSetState({xBounds: event.target.value.split(',')}) }/>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-2">
                                                <div className="form-group">
                                                    <label className="col-sm-6 control-label text-left-forced">
                                                        yBounds:
                                                    </label>
                                                    <div className="col-sm-6">
                                                        <input type="text"
                                                               className="form-control"
                                                               value={this.state.yBounds}
                                                               onChange={(event) => this.safeSetState({yBounds: event.target.value.split(',')}) }/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-sm-offset-1 col-sm-10">
                                                <div className="form-group">
                                                    <label className="col-sm-2 control-label text-left-forced">
                                                        XEquation:
                                                    </label>
                                                    <div className="col-sm-10">
                                                        <input type="text"
                                                               onBlur={() => this.safeSetState({xEquation: this.state.xDisplay})}
                                                               onKeyDown={this.shouldXUpdate}
                                                               className="form-control"
                                                               value={this.state.xDisplay}
                                                               onChange={(event) => this.safeSetState({xDisplay: event.target.value}) }/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-sm-offset-1 col-sm-10">
                                                <div className="form-group">
                                                    <label className="col-sm-2 control-label text-left-forced">
                                                        YEquation:
                                                    </label>
                                                    <div className="col-sm-10">
                                                        <input type="text"
                                                               onBlur={() => this.safeSetState({yEquation: this.state.yDisplay})}
                                                               onKeyDown={this.shouldYUpdate}
                                                               className="form-control"
                                                               value={this.state.yDisplay}
                                                               onChange={(event) => this.safeSetState({yDisplay: event.target.value}) }/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </If>
                            </form>
                        </div>
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <div className="ct-chart ct-perfect-fourth"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
});