const favicon = require("serve-favicon");
const path = require('path');
require('express-async-errors');
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compression = require('compression');
const utils = require('./utils');
const middlewares = require('./middlewares');
const expressHandlebarsMemoryFs = require('express-handlebars-memory-fs');

const isLocal = process.env.NODE_ENV === 'local';
let appConfig = null;

// 初始化 express
function initExpressApp(config) {
    appConfig = config;

    if (!appConfig.appName) {
        throw new Error('请设置应用名称');
    }
    global.appName = appConfig.appName;

    let app = express();

    // 禁用etag
    app.disable('etag');
    app.locals.settings['x-powered-by'] = false;
    // 压缩
    app.use(compression());

    // 图标 & 静态文件目录
    let projectRootPath = appConfig.projectRootPath;
    if (isLocal) {
        app.use(favicon(path.join(projectRootPath, 'client', 'assets', 'favicon.ico')));
    } else {
        app.use(favicon(path.join(projectRootPath, 'dist', 'assets', 'favicon.ico')));
    }
    app.use(express.static(path.join(projectRootPath, "dist")));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());

    if (isLocal) {
        const reload = require("reload");
        reload(app, {
            port: appConfig.build.reloadPort
        });
    }
    return app;
}

// 视图引擎
function useHandlebarsViewEngine(app) {
    const exphbs = require("express-handlebars");
    let projectRootPath = appConfig.projectRootPath;
    // view engine setup
    let hbs = exphbs.create({
        extname: ".hbs",
        defaultLayout: "layout",
        // layoutsDir: path.join(projectRootPath, "dist", "views", "layouts"), // 默认`Views` 文件夹下的 /layouts
        // partialsDir: path.join(projectRootPath, "dist", "views", "partials"),// 默认`Views` 文件夹下的 /partials
        helpers: utils.handlebarsHelpers
    });

    app.set("views", path.join(projectRootPath, "dist", "views"));
    app.engine("hbs", hbs.engine);
    app.set("view engine", "hbs");
    if (!isLocal) {
        app.set('view cache', true);
    }
}

// webpack dev 和 热更新模块
function addWebpackDevAndHotMiddleware(app) {
    if (!isLocal) {
        return;
    }

    const webpack = require("webpack");
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");
    let webpackConfig = require("./build");

    let compiler = webpack(webpackConfig);
    let webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        hot: true,
        writeToDisk: true,
        stats: {
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }
    });

    webpackDevMiddlewareInstance.waitUntilValid(() => {
        console.log("\x1b[92m%s\x1b[0m", __dirname);
        console.log("\x1b[92m%s\x1b[0m", `Server Listening on: http://localhost:${appConfig.appPort}/`);
    });

    let hotMiddlewareInstance = webpackHotMiddleware(compiler);
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

    app.use(webpackDevMiddlewareInstance);

    app.use(hotMiddlewareInstance);

    // expressHandlebarsMemoryFs(compiler.outputFileSystem);
}

// 初始化应用中间件
function initAppMiddlewares(app) {
    // 请求Id
    app.use(middlewares.requestId);

    // 其他中间件
}

// 初始化应用路由前
function beforeInitAppRoutes(app) {
    // logger
    app.use(utils.logger.defaultLogger);
}

// 初始化应用路由后
function afterInitAppRoutes(app) {
    // 捕获404
    app.use(middlewares.notFound);

    // error logger
    app.use(utils.logger.errorLogger);

    // 错误处理
    app.use(middlewares.error);
}

/**
 * 创建http server
 */
function createHttpServer(app) {
    let appPort = normalizePort();
    let server = app.listen(appPort);
    server.on("error", onError);


    // Normalize a port into a number, string, or false.
    function normalizePort() {
        let port = parseInt(appConfig.appPort, 10);
        if (isNaN(port)) {
            // named pipe
            return appConfig.appPort;
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

        let port = parseInt(appConfig.appPort, 10);
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
}

module.exports = {
    initExpressApp,
    useHandlebarsViewEngine,
    addWebpackDevAndHotMiddleware,
    initAppMiddlewares,
    beforeInitAppRoutes,
    afterInitAppRoutes,
    createHttpServer
}