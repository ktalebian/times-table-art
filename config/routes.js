"use strict";

var appRoot = require("app-root-path");
var config = require("./config");
var fs = require("fs");
var express = require("express");
var router = express.Router();


module.exports = function (app) {
    // Front-end routes
    router.get("/", function (req, res) {
        res.render("application", {title: config.pageTitle, ENV: app.get('ENV')});
    });
    app.use("/", router);

    // 404 Page
    app.get('/404', function (req, res, next) {
        res.status(404);

        // respond with html page
        if (req.accepts('html')) {
            res.render('404', {url: req.url, title: config.pageTitles.pageNotFound, ENV: app.get('ENV')});
            return;
        }

        // respond with json
        if (req.accepts('json')) {
            res.send({error: 'Not found'});
            return;
        }

        // default to plain-text. send()
        res.type('txt').send('Not found');
    });


    // 500 error
    app.use(function (err, req, res, next) {
        console.log(err);
        res.render("error", {
            status: err.status || 500,
            error: err,
            title: "Error",
            ENV: app.get('ENV')
        });
    });
};
