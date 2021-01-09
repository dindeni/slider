const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  entry: ['jquery', './src/ts/app.ts'],
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    publicPath: '/',
    contentBase: path.resolve(__dirname, './'),
    compress: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/demoPage/index/index.pug',
      filename: `${path.resolve('./')}/index.html`,
      inject: 'body',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
              reloadAll: true,
            },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff|woff2|svg|ttf|png|webmanifest)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: './files',
            publicPath: './files',

          },
        },
      },
    ],
  },
  devtool: 'cheap-module-eval-source-map',
});
