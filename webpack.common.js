const path = require('path');
const webpack = require('webpack');

const config = {
  entry: ['jquery', './src/ts/app.ts'],
  output: {
    path: path.resolve(__dirname, './src'),
    filename: 'ts/bundle.js'
  },
	resolve: {
		// Add `.ts` and `.tsx` as a resolvable extension.
		extensions: [".ts", ".tsx", ".js"]
	},
		module: {
				rules: [
					{
						test: /\.js$/, // files ending with .js
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
					},
					{
						test: /\.(tsx|ts)?$/,
						loader: 'ts-loader',
						exclude: /node_modules/,
					}
				]
		},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			"window.$": "jquery"
		})
	],
};

module.exports = config;
