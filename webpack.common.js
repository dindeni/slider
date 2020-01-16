const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const config = {
  entry: ['jquery', './src/ts/app.ts'],
  output: {
    path: path.resolve(__dirname, './'),
    filename: './bundle.js',
    publicPath: './',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            ['@babel/preset-env',
              {
                targets: {
                  edge: '17',
                  firefox: '60',
                  chrome: '67',
                  safari: '11.1',

                },
                useBuiltIns: 'usage',
              },
            ],
          ],
        },
      },
      {
        test: /\.pug$/,
        use: ['pug-loader'],
      },
      {
        test: /\.(tsx|ts)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
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
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer(),
        ],
      },
    }),
  ],
};

module.exports = config;
