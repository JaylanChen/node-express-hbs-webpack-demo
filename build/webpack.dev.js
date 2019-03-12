const webpack = require("webpack");
const merge = require("webpack-merge");

const webpackCommonConfig = require("./webpack.common");


module.exports = merge(webpackCommonConfig, {
  mode: "development",
  devtool: "cheap-eval-source-map ",
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
  ]
});