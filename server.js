const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
require('express-async-errors');
const exphbs = require('express-handlebars');

const config = require('./config');
const utils = require('./utils');

// Create global app object
var app = express();

app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(bodyparser.json());

app.use(favicon(path.join(__dirname, 'client', 'assets', 'favicon.ico')));

// view engine setup
var hbs = exphbs.create({
    extname: ".hbs",
    defaultLayout: "layout",
    helpers: utils.handlebarsHelpers,
    // layoutsDir: path.join(projectRootPath, "dist", "views", "layouts"), // 默认`Views` 文件夹下的 /layouts
    // partialsDir: path.join(projectRootPath, "dist", "views", "partials"),// 默认`Views` 文件夹下的 /partials
});

app.set("views", path.join(__dirname, "client", "views"));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
// view engine setup end

app.get('/', function (req, res) {
    res.render('home/index');
});

// finally, let's start our server...
var appPort = normalizePort(config.appPort);
var server = app.listen(appPort, function () {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Express server listening on " + bind);
});
server.on("error", onError);

// Normalize a port into a number, string, or false.
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      return val;
    }
    if (port >= 0) {
      // port number
      return port;
    }
    return false;
  }

// Event listener for HTTP server "error" event.
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