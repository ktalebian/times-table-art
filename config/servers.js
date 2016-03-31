'use strict';

var http = require('http');
var fs = require('fs');
var config = require('./config');

module.exports = function(app) {
    // Start servers
    var httpServer = http.Server(app);
    httpServer.listen(config.http_port, function () {
        console.info("HTTP server running on %d", config.http_port);
    });
    return {unsecure: httpServer};
};
