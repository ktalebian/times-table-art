"use strict";

var appRoot = require("app-root-path");
var express = require("express");
var config = require("./config");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var favicon = require("serve-favicon");
var env = process.env.NODE_ENV || 'local';

module.exports = function(app) {
    app.set('ENV', env);
    app.set("views", appRoot + "/views");
    app.set("view engine", config.templateEngine);
    app.enable("trust proxy");

    //app.use(favicon(appRoot + "/public/assets/img/favicon.ico"));
    app.use(bodyParser.json({limit: "100mb"}));
    app.use(bodyParser.urlencoded({extended: true, limit: "100mb"}));
    app.use(cookieParser());
    app.use(flash());

    app.use(express.static(appRoot + "/public"));
};
