//配置
const config = require('./config');
const serverCommon = require("./server.common");


var app = serverCommon.initExpressApp(config);

serverCommon.useHandlebarsViewEngine(app);

serverCommon.addWebpackDevAndHotMiddleware(app);

serverCommon.initAppMiddlewares(app);

serverCommon.beforeInitAppRoutes(app);

serverCommon.beforeInitAppRoutes(app);

const routes = require('./routes');
routes(app);

serverCommon.afterInitAppRoutes(app);

serverCommon.createHttpServer(app);