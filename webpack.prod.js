const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const webpack = require("webpack");
const CopyPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				postcss: [
					autoprefixer()
				]
			}
		}),
		new CopyPlugin([
			{from: 'src/fonts', to: 'fonts'},
			{from: 'src/*.html', to: path.resolve(__dirname, './build'),
			flatten: true},
			{from: 'src/files', to: path.resolve(__dirname, './build/files'),
				flatten: true},
			{from: 'src/readme.md', to: path.resolve(__dirname, './build')}
		])
	],
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: ['pug-loader']
			},
			{
				test: /\.scss|css$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"postcss-loader",
					"sass-loader"
				]
			}
		]
	},
		output: {
				path: path.resolve(__dirname, './build'),
				filename: 'ts/bundle.js'
		},
		mode: 'production',
});
