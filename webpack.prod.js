const merge = require('webpack-merge');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/pugTemplates/index.pug',
      filename: './index.html',
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: './style.css',
      publicPath: '/',
    }),
  ],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: './js/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|svg|ttf|png)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: './files',
            publicPath: './files',

          },
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'production',
              reloadAll: true,
            },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',

        ],
      },
    ],
  },
  mode: 'production',
});
