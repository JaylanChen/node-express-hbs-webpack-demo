const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
require('express-async-errors');
const exphbs = require('express-handlebars');

const config = require('./config');
const utils = require('./utils');
const routes = require('./routes');

const isLocal = process.env.NODE_ENV === 'local';


// Create global app object
let app = express();
global.appName = config.appName;

app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(bodyparser.json());

// view engine setup
let hbs = exphbs.create({
    extname: ".hbs",
    defaultLayout: "layout",
    helpers: utils.handlebarsHelpers,
    // layoutsDir: path.join(projectRootPath, "dist", "views", "layouts"), // 默认`Views` 文件夹下的 /layouts
    // partialsDir: path.join(projectRootPath, "dist", "views", "partials"),// 默认`Views` 文件夹下的 /partials
});

app.set("views", path.join(__dirname, "dist", "views"));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
if (!isLocal) {
    app.set('view cache', true);
}

// 图标 & 静态文件目录
let projectRootPath = config.projectRootPath;
if (isLocal) {
    app.use(favicon(path.join(projectRootPath, 'client', 'assets', 'favicon.ico')));
    app.use(express.static(path.join(projectRootPath, "client")));
} else {
    app.use(favicon(path.join(projectRootPath, 'dist', 'assets', 'favicon.ico')));
    app.use(express.static(path.join(projectRootPath, "dist")));
}
// view engine setup end


if (isLocal) {
    addWebpackDevAndHotMiddleware(app);
}

// logger
app.use(utils.logger.defaultLogger);

routes(app);

// error logger
app.use(utils.logger.errorLogger);

// finally, let's start our server...
let appPort = normalizePort(config.appPort);
let server = app.listen(appPort, function () {
    let addr = server.address();
    let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Express server listening on " + bind);
});
server.on("error", onError);



// webpack dev 和 热更新模块
function addWebpackDevAndHotMiddleware(app) {
    const webpack = require("webpack");
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");
    let webpackConfig = require("./build");

    let compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        hot: true,
        writeToDisk: function (fliePath) {
            if (fliePath.endsWith('.hbs')) {
                return true;
            }
            return false;
        },
        stats: {
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }
    }));

    let hotMiddleware = webpackHotMiddleware(compiler);
    // compiler.plugin('compilation', function (compilation) {
    //   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    //     //let cccc = compilation.getStats().toJson();
    //     hotMiddleware.publish({
    //       action: 'hbs-reload',
    //       data: data
    //     })
    //     if(cb){
    //       cb()
    //     }
    //   })
    // })
    app.use(hotMiddleware);
}

// Normalize a port into a number, string, or false.
function normalizePort(val) {
    let port = parseInt(val, 10);
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
    let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
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