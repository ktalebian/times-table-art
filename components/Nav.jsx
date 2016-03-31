'use strict';

var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <header id="header" role="banner">
                <div className="container">
                    <div id="navbar" className="navbar navbar-default">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse"
                                    data-target=".navbar-collapse">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                        </div>
                        <div className="collapse navbar-collapse">
                            <ul className="nav navbar-nav">
                                <li className="active"><a href="#main-slider"><i className="fa fa-home"></i></a></li>
                                <li><a href="#services">Create Drawing</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
});