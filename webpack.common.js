const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/ts/app.ts',
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
                targets: '> 0.25%, not dead',
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
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer(),
        ],
      },
    }),
    new MiniCssExtractPlugin({
      filename: './style.css',
    }),
  ],
};
