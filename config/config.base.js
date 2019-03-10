const path = require('path');

const appPort = 9386;
const webHost = `http://localhost:${appPort}/`;
const projectRootPath = path.resolve(__dirname, '..');

module.exports = {
    appName: 'node-express-server',
    appPort,
    projectRootPath,
    urls: {
        remoteServiceBaseUrl: 'http://api.jaylan.net/',
        appBaseUrl: webHost
    }
}