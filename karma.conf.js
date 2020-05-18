const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],
    client: {
      jasmine: {
        random: false,
      },
    },

    files: [
      'src/tests/*.js',
    ],

    exclude: [
    ],

    preprocessors: {
      'src/tests/*.js': ['webpack'],
      'test/**/*.js': ['webpack'],
    },

    webpack: {
      entry: ['jquery'],
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.pug'],
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: path.resolve(__dirname, 'node_modules'),
            query: {
              presets: ['@babel/preset-env',
                {
                  exclude: ['transform-async-to-generator', 'transform-regenerator'],
                },
              ],
            },
          },
          {
            test: /\.tsx|ts?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.(scss|css)$/,
            use: [
              'css-loader',
              'postcss-loader',
              'sass-loader',
            ],
          },
          {
            test: /\.(woff|woff2|svg|ttf|png)(\?v=\d+\.\d+\.\d+)?$/,
            use: {
              loader: 'file-loader',
              options: {
                outputPath: 'files',
              },
            },
          },
          {
            test: /\.pug$/,
            use: ['pug-loader'],
          },
        ],
      },
      plugins: [
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery',
          'window.$': 'jquery',
        }),
        new HtmlWebpackPlugin({
          template: './src/blocks/panel/panel.pug',
          filename: `${path.resolve('./')}/index.html`,
          inject: 'body',
        }),
      ],
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    singleRun: false,

    concurrency: Infinity,
  });
};
