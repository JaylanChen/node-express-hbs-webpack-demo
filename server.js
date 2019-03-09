const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
require('express-async-errors');

// Create global app object
var app = express();

app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(bodyparser.json());

app.use(favicon(path.join(__dirname, 'client', 'assets', 'favicon.ico')));

app.get('/', function (req, res) {
    res.send('hello world');
});

// finally, let's start our server...
var server = app.listen(9386, function () {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Express server listening on " + bind);
});
server.on("error", onError);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}