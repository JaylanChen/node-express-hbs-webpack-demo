const path = require('path');

const appPort = 9386;
const webHost = `http://localhost:${appPort}/`;
const projectRootPath = path.resolve(__dirname, '..');
const viewsOutputPath = path.join(projectRootPath, 'dist', 'views');
const viewsSourcePath = path.join(projectRootPath, 'client', 'views');

module.exports = {
    appName: 'node-express-server',
    appPort,
    projectRootPath,
    build: {
        publicPath: '/',
        viewsOutputPath: viewsOutputPath,
        viewsSourcePath: viewsSourcePath
    },
    urls: {
        remoteServiceBaseUrl: 'http://api.jaylan.net/',
        appBaseUrl: webHost
    },
    log: {
        host: '127.0.0.1',
        port: 8086,
        ssl: false,
        // path: '',
        // auth: {},
        // headers: {},
        // application: '',
        // name: 'customLogger',
        // enableQueue: true,
        // limit: 1000,
        // intervalTime: 60
    }
}