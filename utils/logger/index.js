const winston = require("winston");
require("winston-daily-rotate-file");
const expressWinston = require("express-winston");
const customTransport = require('./customTransport')
const config = require('../../config')

let consoleTransport = new winston.transports.Console({
  json: true,
  colorize: true
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

let defaultLogger = expressWinston.logger({
  transports: defaultTransportArr,
  ignoreRoute: ignoreRoute,
  dynamicMeta: (req, res) => {
    return {
      appName: global.appName,
      // sessionID: req["sessionID"],
      // "X-Request-Id": req["X-Request-Id"]
    };
  }
});

let errorLogger = expressWinston.errorLogger({
  transports: errorTransportArr,
  ignoreRoute: ignoreRoute,
  dynamicMeta: (req, res) => {
    return {
      appName: global.appName
    };
  }
});


let customLogger = winston.createLogger({
  transports: defaultTransportArr,
  level: 'warn',
  dynamicMeta: (req, res) => {
    return {
      appName: global.appName
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
