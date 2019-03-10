const Transport = require("winston-transport");
const axios = require("axios");

let _logQueue = [];
let _timer = null;

module.exports = class CustomTransport extends Transport {
  constructor(opts = {}) {
    super(opts);

    this.name = options.name || "custom";
    this.application = opts.application || "application";

    this.enableQueue = !!options.enableQueue;
    this.limit = options.limit || 1000;
    this.intervalTime = (options.intervalTime || 60) * 1000; // 60s

    this.ssl = !!options.ssl;
    this.host = options.host || "localhost";
    this.port = options.port;
    this.auth = options.auth;
    this.path = options.path || "";
    this.headers = options.headers || {};
    this.headers["content-type"] = "application/json";

    if (!this.port) {
      this.port = this.ssl ? 443 : 80;
    }
    if (this.enableQueue && this.limit <= 0) {
      this.enableQueue = false;
    }
    this.path = `${this.path.replace(/^\//, "")}`;
    InitAxiosInterceptor();

    if(this.enableQueue && this.intervalTime > 0){
      let logArr = _logQueue.splice(0, this.limit);
      _timer = setInterval(_logHttpRequest(logArr,() => {}), this.intervalTime)
    }
  }

  log(logInfo, callback) {
    if (this.enableQueue && this._logQueue.length < this.limit) {
      let logArr = _logQueue.splice(0, this.limit);
      _logHttpRequest(logArr, (error, response) => {
        if (error) {
          this.emit("warn", err);
        } else {
          if (_timer) {
            clearInterval(_timer);
            _timer = setInterval(_logHttpRequest(logArr,() => {}), this.intervalTime)
          }
          this.emit("logged", info);
        }
      });
    } else {
      let { level, message, req, res, error, metaData } = logInfo;
      if (!metaData) {
        metaData = {};
      }
      let method = req.method.toLowerCase();
      //metaData["X-Request-Id"] = req["X-Request-Id"];
      metaData.requestBody = JSON.stringify(method === "get" ? req.query : req.body);
      metaData.method = method;
      metaData.xbheaders = JSON.stringify(req.headers);
      metaData.url = req.host + req.url;
      metaData.token = req.token;

      if(error){
        metaData.apiUrl = error.config && error.config.url;
        metaData.errorStack = JSON.stringify(metaData.err.stack);
      }

      this._logQueue.push({
        env: process.env.NODE_ENV,
        application: this.application,
        level: level || 'info',
        msg: message,
        data: metaData
      });
      this.emit("logged", logInfo);
    }

    if (callback) {
      setImmediate(callback);
    }
  }

  InitAxiosInterceptor() {
    // 添加请求拦截器
    axios.interceptors.request.use(function(config) {
      config.baseURL = `${this.ssl ? "https" : "http"}://${this.host}:${this.port}`;
      config.headers["X-Requested-With"] = "XMLHttpRequest";
      config.headers = Object.assign(config.headers, this.headers);
      if (this.auth) {
        config.auth = this.auth;
      }
      return config;
    });
  }

  _logHttpRequest(logArr, callback) {
    axios.post(this.path, logArr).then(function(response) {
      callback(null, response.data);
    }).catch(function(error) {
      callback(error);
    });
  }
};
