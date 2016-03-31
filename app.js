'use strict';

var app = require('express')();

require("./config/servers")(app);
require("./config/setup")(app);
require("./config/routes")(app);

module.exports = app;
