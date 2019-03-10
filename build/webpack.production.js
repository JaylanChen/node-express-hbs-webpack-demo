const webpack = require("webpack");
const merge = require("webpack-merge");
const webpackCommonConfig = require("./webpack.common");

const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(webpackCommonConfig, {
  mode: "production",
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          discardComments: { removeAll: true }
        },
        canPrint: true,
      }),
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        // sourceMap: false,
        uglifyOptions: {
          compress: {
            // warnings: false,
            // drop_debugger: true,
            drop_console: true
          },
        }
      })
    ]
  }
});