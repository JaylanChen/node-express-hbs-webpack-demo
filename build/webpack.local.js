const webpack = require("webpack");
const merge = require("webpack-merge");
const config = require('../config');
const path = require('path');

const webpackCommonConfig = require("./webpack.common");

const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
// 将 Hol-reload 相对路径添加到 webpack.base.conf 的 对应 entry 前
Object.keys(webpackCommonConfig.entry).forEach(function (name) {
    //webpackCommonConfig.entry[name] = ['./dev-client'].concat(webpackCommonConfig.entry[name])
    webpackCommonConfig.entry[name] = [hotMiddlewareScript].concat(webpackCommonConfig.entry[name])
})

module.exports = merge(webpackCommonConfig, {
    mode: "development",
    devtool: "eval",
    devServer: {
        contentBase: path.join(__dirname, '..', 'dist'),
        hot: true,
        historyApiFallback: true,
        noInfo: false,
        host: '0.0.0.0',
        port: config.appPort,
        overlay: {
            errors: true,
        },
    },
    plugins: [
        // 开启webpack全局热更新
        new webpack.HotModuleReplacementPlugin(),
        // 当接收到热更新信号时，在浏览器console控制台打印更多可读性高的模块名称等信息
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin()

    ]
});