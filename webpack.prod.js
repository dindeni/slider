const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

const loadFiles = (isEmit) => {
  return {
    test: /\.(woff|woff2|svg|ttf|png|webmanifest)(\?v=\d+\.\d+\.\d+)?$/,
    use: {
      loader: 'file-loader',
      options: {
        outputPath: './files',
        publicPath: './files',
        emitFile: isEmit,
      },
    },
  };
};

const config = {
  plugins: [
    new CleanWebpackPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: './js/bundle.js',
  },
  module: {
    rules: [
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
};

const configWithDemoPage = {
  entry: ['jquery', './src/app.ts'],
  module: {
    rules: [
      loadFiles(true),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/demoPage/index/index.pug',
      filename: `${path.resolve(__dirname, './build')}/index.html`,
      inject: 'body',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
    }),
  ],
};

const configOnlySlider = {
  entry: './src/app.ts',
  output: {
    path: path.resolve(__dirname, './build'),
  },
  module: {
    rules: [
      loadFiles(false),
    ],
  },
};

module.exports = (_env, options) => {
  if (options.withDemoPage) {
    return merge(common, config, configWithDemoPage);
  }
  return merge(common, config, configOnlySlider);
};
