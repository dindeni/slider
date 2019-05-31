const path = require('path');
const webpack = require('webpack');

const config = {
  entry: ['./src/ts/app.ts'],
  output: {
    path: path.resolve(__dirname, './src'),
    filename: 'ts/bundle.js'
  },
		module: {
				rules: [
					{
						test: /\.js$/, // files ending with .ts
						exclude: /node_modules/, // exclude the node_modules directory
						loader: "babel-loader", // use this (babel-core) loader
						query: {
								presets:[
										['@babel/preset-env',
										{
												targets: {
														edge: "17",
														firefox: "60",
														chrome: "67",
														safari: "11.1",

												},
											'corejs': '3.0.0',
												useBuiltIns: "usage",
										},
								],
								],

						}
				},
					{
						test: /\.(woff|woff2|svg|ttf|png)(\?v=\d+\.\d+\.\d+)?$/,
						use: {
							loader: "file-loader",
							options: {
								outputPath: 'files'

							}
						}
					}
				]
		},
	plugins: [
	],
};

module.exports = config;
