var base = require('./config.base')

if (process.env.NODE_ENV === 'production') {
    base.appPort = 80;
    base.urls.remoteServiceBaseUrl = "http://api.jaylan.com/";
    base.urls.appBaseUrl = 'http://front.jaylan.com/';
}

module.exports = base;