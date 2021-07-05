const webpack = require("webpack");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpackBaseConfig = require("./webpack.base");

const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(webpackBaseConfig, {
  mode: "production",
  plugins: [new CleanWebpackPlugin()],
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          discardComments: { removeAll: true },
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
            drop_console: true,
          },
        },
      }),
    ],
  },
});
