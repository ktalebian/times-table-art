'use strict';

var _ = require('lodash');

module.exports = function () {
    var Mixin = {
        increment: function (stateName, step, options) {
            step = step || 1;
            var state = Number(this.state[stateName]);
            if (state) {
                state += step;
                if (options && options.max && state > options.max) {
                    return;
                }
                var obj = {};
                obj[stateName] = state;
                this.safeSetState(obj);
            }
        },

        decrement: function (stateName, step, options) {
            step = step || 1;
            var state = Number(this.state[stateName]);
            if (state) {
                state -= step;
                if (options && options.min && state < options.min) {
                    return;
                }
                var obj = {};
                obj[stateName] = state;
                this.safeSetState(obj);
            }
        },

        safeSetState: function (args, forceChanges) {
            forceChanges = forceChanges || false;

            if (this.isMounted() && !_.isEmpty(args)) {
                var hasChanges = false;
                for (var key in args) {
                    if (args.hasOwnProperty(key)) {
                        var newValue = args[key];
                        var oldValue = this.state[key];
                        hasChanges = hasChanges || !_.isEqual(newValue, oldValue);
                    }
                }

                if (hasChanges || forceChanges) {
                    this.setState(args);
                }
            }
        },

        /**
         * Provices componentStatesWillUpdate and componentPropsWillUpdate
         *      They are only called when a state (or props) is updated and changed
         *      from current value
         * @param nextProps
         * @param nextStates
         */
        componentWillUpdate: function (nextProps, nextStates) {
            if (this.componentStatesWillUpdate) {
                var changedStates = {};
                for (var key in nextStates) {
                    if (nextStates.hasOwnProperty(key)) {
                        if (!_.isEqual(nextStates[key], this.state[key])) {
                            changedStates[key] = nextStates[key];
                        }
                    }
                }
                if (!_.isEmpty(changedStates)) {
                    this.componentStatesWillUpdate(changedStates);
                }
            }

            if (this.componentPropsWillUpdate) {
                var changedProps = {};
                for (var key in nextProps) {
                    if (nextProps.hasOwnProperty(key)) {
                        if (!_.isEqual(nextProps[key], this.props[key])) {
                            changedProps[key] = nextProps[key];
                        }
                    }
                }
                if (!_.isEmpty(changedProps)) {
                    this.componentPropsWillUpdate(changedProps);
                }
            }
        }
    };

    return Mixin;
};