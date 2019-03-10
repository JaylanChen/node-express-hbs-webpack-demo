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
    }
}