const webpack = require("webpack");
const merge = require("webpack-merge");

const webpackBaseConfig = require("./webpack.base");


module.exports = merge(webpackBaseConfig, {
  mode: "development",
  devtool: "cheap-eval-source-map ",
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
  ]
});