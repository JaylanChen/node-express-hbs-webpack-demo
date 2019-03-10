const path = require('path');
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackCustomInjectPlugin = require('html-webpack-custominject-plugin');

const config = require('../config');
const htmlWebpackPlugins = require('./plugins/multi-html-webpack-plugin');

const publicPath = config.build.publicPath;
const isLocal = process.env.NODE_ENV === 'local';

module.exports = {
  entry: {
    'home.index': ['./client/js/home/index.js'],
  },
  output: {
    filename: isLocal ? 'js/[name]-[hash:8].js' : 'js/[name]-[contenthash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: publicPath
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...htmlWebpackPlugins,
    new HtmlWebpackCustomInjectPlugin(),
    new MiniCssExtractPlugin({
      filename: isLocal ? 'js/[name]-[hash:8].css' : 'css/[name]-[contenthash:8].css',
    }),
    new webpack.ProgressPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '..', 'client', 'assets'),
      to: path.resolve(__dirname, '..', 'dist', 'assets')
    }]),
    // new CopyWebpackPlugin([{
    //   from: path.resolve(__dirname, '..',  'client', 'font'),
    //   to: path.resolve(__dirname, '..',  'dist', 'font')
    // }])
  ],
  module: {
    rules: [{
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
        }, {
          loader: 'express-template-reload',
          options: {
            enable: isLocal,
            name: '[name].hbs', // view的名字
            jsRootDir: 'client/js/', // js相对于项目的目录
            templateRootDir: 'client/views/', // View相对于项目的目录
            //nameFormat: name => name.substr(name.indexOf('views/') + 6, name.length),
            jsHotAccept: true
          }
        }],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          isLocal ? 'style-loader' : MiniCssExtractPlugin.loader,
          //MiniCssExtractPlugin.loader,
          "css-loader"
        ],
        exclude: /node_modules/
      },
      // {
      //     test: /\.less$/,
      //     use: extractTextPlugin.extract({
      //         fallback:"style-loader",
      //         use: ["css-loader", "less-loader"]
      //     })
      // },
      // {
      //     test: /\.(scss|sass)$/,
      //     use: extractTextPlugin.extract({
      //         fallback:"style-loader",
      //         use: ["css-loader", "sass-loader"]
      //     })
      // },
      {
        test: /\.hbs$/,
        oneOf: [{
            resourceQuery: /client/,
            loader: 'handlebars-loader',
            query: {
              helperDirs: [
                path.join(__dirname, '..', 'utils', 'hbs.helpers')
              ],
              partialDirs: [
                path.join(__dirname, '..', 'views', 'partials')
              ]
            }
          },
          {
            loader: 'raw-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: "/images/[name]-[hash:8].[ext]",
            publicPath: publicPath
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: "/css/font/[name]-[hash:8].[ext]",
            publicPath: publicPath
          }
        },
        exclude: /node_modules/,
      }
    ]
  },

};