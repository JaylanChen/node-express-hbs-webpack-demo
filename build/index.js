//这里面自动处理环境返回的config
let config = {};
if (process.env.NODE_ENV === 'production') {
    config = require('./webpack.production');
} else if (process.env.NODE_ENV === 'local') {
    config = require('./webpack.local');
} else { //process.env.NODE_ENV === 'dev'
    config = require('./webpack.dev');
}
module.exports = config;