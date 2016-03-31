'use strict';

/**
 * If component module
 * Usage:
 *  <If condition={someCondition} >
 *     <div>content</div>
 *  </If>
 *
 * Notes: The children has to be wrapped in one div
 *  i.e this will not work:
 *      <If condition={someCondition} >
 *          <div>content</div>
 *          <div>content</div>
 *      </If>
 */

var React = require('react');

module.exports = React.createClass({
    render: function () {
        if (this.props.condition) {
            return this.props.children;
        }
        return false;
    }
});