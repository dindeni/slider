// Karma configuration
// Generated on Thu Jun 06 2019 16:46:45 GMT+0300 (Moscow Standard Time)

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'src/tests/*.js',
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "src/tests/*.js": ['webpack'],
      "test/**/*.js": ['webpack'],
    },

      webpack: {
          entry: ['jquery'],
          resolve: {
              // Add `.ts` and `.tsx` as a resolvable extension.
              extensions: [".ts", ".tsx", ".js"]
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
                                /* ... */
                                "exclude": ["transform-async-to-generator", "transform-regenerator"]
                            }
                        ],
                    }
                },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                },
            ]
        },
          plugins: [
              new webpack.ProvidePlugin({
                  $: 'jquery',
                  jQuery: 'jquery',
                  'window.jQuery': 'jquery',
                  "window.$": "jquery"
              }),
          ],
      },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};