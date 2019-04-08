const winston = require("winston");
require("winston-daily-rotate-file");
const expressWinston = require("express-winston");
const customTransport = require('./customTransport')
const config = require('../../config')

let consoleTransport = new winston.transports.Console({
  json: true,
  colorize: true,
  level: 'warn'
});

// 自定义日志转换器
// let customTransport = new customTransport(config.log);

let defaultTransportArr = [getDailyRotateFileTransport('default')];
let errorTransportArr = [getDailyRotateFileTransport('error')];
let customTransportArr = [getDailyRotateFileTransport('custom')];
if (process.env.NODE_ENV !== "production") {
  defaultTransportArr.push(consoleTransport);
  errorTransportArr.push(consoleTransport);
  customTransportArr.push(consoleTransport);
}


const requestWhitelist = ['url', 'headers', 'cookies', 'method', 'ip', 'xhr', 'httpVersion', 'originalUrl', 'query', 'body', 'hostname'];

const dynamicMeta = (req, res) => {
  return {
      token: req.token,
      appName: config.appName,
      date: new Date().toString()
  }
}

let defaultLogger = expressWinston.logger({
  transports: defaultTransportArr,
  ignoreRoute: ignoreRoute,
  requestWhitelist,
  dynamicMeta
});

let errorLogger = expressWinston.errorLogger({
  transports: errorTransportArr,
  ignoreRoute: ignoreRoute,
  requestWhitelist,
  dynamicMeta,
  blacklistedMetaFields: ['date', 'process', 'os', 'error', 'level']
});


let customLogger = winston.createLogger({
  transports: defaultTransportArr,
  level: 'warn',
  defaultMeta: (req, res) => {
    return {
      appName: global.appName,
      date: new Date().toString()
    };
  }
})

function getDailyRotateFileTransport(type){
  return new winston.transports.DailyRotateFile({
    filename: `%DATE%-${type}.log`,
    datePattern: "YYYY-MM-DD",
    dirname: "logs"
  });
}

function ignoreRoute(req, res) {
  const ingoreUrlArr = ['/__webpack_hmr', '/favicon.ico'];
  if (ingoreUrlArr.indexOf(req.url) > -1) return true;
  return false;
}

module.exports = {
  defaultLogger,
  errorLogger,
  customLogger
};
