const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackCustomInjectPlugin = require("html-webpack-custominject-plugin");

const config = require("../config");
const htmlWebpackPlugins = require("./plugins/multi-html-webpack-plugin");

const publicPath = config.build.publicPath;
const isLocal = process.env.NODE_ENV === "local";
const projectRootPath = path.resolve(__dirname, "..");

module.exports = {
  entry: {
    "home.index": ["./client/js/home/index.js"],

    "shared.404": ["./client/js/shared/404.js"],
    "shared.500": ["./client/js/shared/500.js"],
  },
  output: {
    filename: isLocal ? "js/[name]-[hash:8].js" : "js/[name]-[contenthash:8].js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: publicPath,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: `vendor`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "initial", // async 表示对异步模块起作用， initial 表示对初始模块起作用， all 则表示对所有模块起作用
        },
        corejs: {
          name: "core-js",
          test: /[\\/]node_modules[\\/]core-js[\\/]/,
          priority: 10,
          chunks: "initial",
        },
        jquery: {
          name: "jquery",
          test: /[\\/]node_modules[\\/]jquery[\\/]/,
          priority: 10,
          chunks: "initial",
        },
        // common: {
        //   name: `chunk-common`,
        //   minChunks: 2,
        //   priority: -20,
        //   chunks: 'initial',
        //   reuseExistingChunk: true
        // }
      },
    },
    // runtimeChunk: {
    //   name: 'manifest'
    // }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": process.env.NODE_ENV,
    }),
    ...htmlWebpackPlugins,
    new HtmlWebpackCustomInjectPlugin(),
    new MiniCssExtractPlugin({
      filename: isLocal ? "css/[name]-[hash:8].css" : "css/[name]-[contenthash:8].css",
      chunkFilename: "[id].css",
    }),
    new webpack.ProgressPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(projectRootPath, "client", "views", "layouts"),
          to: path.resolve(projectRootPath, "dist", "views", "layouts"),
        },
        {
          from: path.resolve(projectRootPath, "client", "views", "partials"),
          to: path.resolve(projectRootPath, "dist", "views", "partials"),
        },
        {
          from: path.resolve(projectRootPath, "client", "assets"),
          to: path.resolve(projectRootPath, "dist", "assets"),
        },
        // {
        //   from: path.resolve(projectRootPath, "client", "font"),
        //   to: path.resolve(projectRootPath, "dist", "font"),
        // },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader?cacheDirectory=true",
          },
          {
            loader: "express-template-reload",
            options: {
              enable: isLocal,
              name: "[name].hbs", // view的名字
              jsRootDir: "client/js/", // js相对于项目的目录
              templateRootDir: "client/views/", // View相对于项目的目录
              //nameFormat: name => name.substr(name.indexOf('views/') + 6, name.length),
              jsHotAccept: true,
            },
          },
        ],
        // exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [isLocal ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader"],
        // exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isLocal,
            },
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.hbs$/,
        oneOf: [
          {
            resourceQuery: /client/,
            loader: "handlebars-loader",
            query: {
              helperDirs: [path.join(projectRootPath, "utils", "hbs.helpers")],
              partialDirs: [path.join(projectRootPath, "views", "partials")],
            },
          },
          {
            loader: "raw-loader",
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
            name: "images/[name]-[hash:8].[ext]",
            publicPath: publicPath,
          },
        },
        // exclude: /node_modules/,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
            name: "css/font/[name]-[hash:8].[ext]",
            publicPath: publicPath,
          },
        },
        // exclude: /node_modules/,
      },
    ],
  },
};
