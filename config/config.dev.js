var base = require('./config.base')

if (process.env.NODE_ENV === 'dev') {
    base.appPort = 80;
    base.urls.remoteServiceBaseUrl = "http://devapi.jaylan.com/";
    base.urls.appBaseUrl = 'http://devfront.jaylan.com/';
}

module.exports = base;