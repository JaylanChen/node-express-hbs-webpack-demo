//自动添加html-web-plugin
const fs = require('fs');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const config = require('../../config')
const path = require('path');

var htmlWebpackPlugins = [];

var walk = function (dir) {
    var files = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = files.concat(walk(file));
        } else {
            //如果是文件 那么添加到htmlwebplugin
            //如果是layout下的 那么不创建默认的chunks
            var option = {
                inject: false,
                template: file,
                cache: true,
                filename: file.substr(file.indexOf('views'), file.length),
                custominject: true,
                styleplaceholder: '<!--webpack_style_placeholder-->',
                scriptplaceholder: '<!--webpack_script_placeholder-->',
                chunks: []
            }

            if (file.indexOf('layout') === -1) {
                //这个地方正式chunks的植入, 对应webpack 配置的entry的key
                //chunks命名规则就是 views文件夹下的 `目录名.文件名`，如：home.index
                const chunk = file.replace(config.build.viewsSourcePath, '').replace(path.extname(file), '').replace('/', '').replace(/\//g, '.');
                option.chunks.push(chunk);
            }
            htmlWebpackPlugins.push(new HtmlWebpackPlugin(option))
        }
    });
    return htmlWebpackPlugins;
}
walk(config.build.viewsSourcePath)
module.exports = htmlWebpackPlugins;