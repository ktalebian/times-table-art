"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var Router = ReactRouter.Router;
var IndexRoute = ReactRouter.IndexRoute;

var History = require('history');
var BrowserHistory = History.createHistory();

var Slider = require('./Slider.jsx');
var Nav = require('./Nav.jsx');
var Drawing = require('./Drawing.jsx');

var Application = React.createClass({
    render: function () {
        return (
            <div id="wrapper">
                <Nav />
                <Slider />
                <Drawing />
            </div>
        )
    }
});

var routes = (
    <Router history={BrowserHistory}>
        <Route path="/" component={Application}>
        </Route>
    </Router>
);

var nodeApplication = document.getElementById("application");

if (nodeApplication) {
    ReactDOM.render(routes, nodeApplication)
}