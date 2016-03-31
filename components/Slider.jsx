"use strict";

var React = require('react');

module.exports = React.createClass({
    render: function() {
        return (
            <section id="main-slider" className="carousel">
                <div className="carousel-inner">
                    <div className="item active">
                        <div className="container">
                            <div className="carousel-content">
                                <h1>Times Table Art</h1>
                                <p className="lead">Visual Representation of the Multiplication Time</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
});