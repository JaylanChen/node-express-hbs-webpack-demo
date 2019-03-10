//这里面自动处理环境返回的config
const dev = require('./webpack.dev')
const local = require('./webpack.local')
const production = require('./webpack.prod')

let config = {};
if (process.env.NODE_ENV === 'production') {
    config = production;
} else if (process.env.NODE_ENV === 'local') {
    config = local;
} else { //process.env.NODE_ENV === 'dev'
    config = dev;
}
module.exports = config;