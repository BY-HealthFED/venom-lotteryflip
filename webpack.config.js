
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const DefinePlugin = webpack.DefinePlugin;

let cdn = process.env.PUBLIC_PATH || './';

const evn = process.env.UAT_ENV;
const isUat = evn === 'uat' ? true : false;

const sass = require('node-sass');
/**
 * This handy function converts JS values to Sass values,
 * such as an JSON object to a Sass map, making it possible
 * to use the values from our JS in our Sass
 */
const sassUtils = require('node-sass-utils')(sass);
const sassVars = require(__dirname + '/theme.config.js');

// Convert js strings to dimensions
const convertStringToSassDimension = function(result) {
	// Only attempt to convert strings
	if (typeof result !== "string") {
	  return result;
	}
  
	const cssUnits = [
	  "rem",
	  "em",
	  "vh",
	  "vw",
	  "vmin",
	  "vmax",
	  "ex",
	  "%",
	  "px",
	  "cm",
	  "mm",
	  "in",
	  "pt",
	  "pc",
	  "ch"
	];
	const parts = result.match(/[a-zA-Z]+|[0-9]+/g);
	const value = parts[0];
	const unit = parts[parts.length - 1];
	if (cssUnits.indexOf(unit) !== -1) {
	  result = new sassUtils.SassDimension(parseInt(value, 10), unit);
	}
  
	return result;
};

const getSassKey = function(keys) {
	keys = keys.getValue().split(".");
	let result = sassVars;
	let i;
	for (i = 0; i < keys.length; i++) {
	  result = result[keys[i]];
	  // Convert to SassDimension if dimenssion
	  if (typeof result === "string") {
			result = convertStringToSassDimension(result);
	  } else if (typeof result === "object") {
			Object.keys(result).forEach((key) => {
				let value = result[key];
				result[key] = convertStringToSassDimension(value);
			});
	  }
	}
	result = sassUtils.castToSass(result);
	return result;
};



module.exports = (env, argv) => ({
	entry: './src/index.js',
	context: path.resolve(__dirname),
	output: {
		library: '___LotteryFlip___',
		libraryTarget: 'umd',
		path: path.resolve(__dirname, 'dist'),
		filename: 'lotteryflip.js',
		publicPath: argv.mode === 'development' ? '/' : cdn
	},
	module: {
		rules: [
			{
				enforce: "pre",
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "eslint-loader"
			},
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader'
				},
				exclude: '/node_modules/'
			}, {
				test: /\.(scss|css)$/,
				include: [
					path.resolve(__dirname, "src/modules")
				],
				use: [
					// {
					// 	loader: MiniCssExtractPlugin.loader,
					// 	options: {
					// 		publicPath: argv.mode === 'development' ? '/' : cdn
					// 	}
					// },
					{
						loader: "style-loader"
					},
					"css-loader?modules&localIdentName=[name][hash:base64:8]", {
						loader: `postcss-loader`,
						options: {
							sourceMap: true
						}
					}, {
						loader: "sass-loader",
						options: {
							sourceMap: true,
							data: '@import "variables.scss";',
							includePaths: [path.resolve(__dirname, "src/style")],
							functions: {
								"get($keys)" : getSassKey
							}
						}
					}
				]
			}, {
				test: /\.(scss|css)$/,
				include: [
					path.resolve(__dirname, "src/style")
				],
				use: [
					// {
					// 	loader: MiniCssExtractPlugin.loader,
					// 	options: {
					// 		publicPath: argv.mode === 'development' ? '/' : cdn
					// 	}
					// },
					{
						loader: "style-loader"
					},
					"css-loader", {
						loader: `postcss-loader`,
						options: {
							sourceMap: true
						}
					}, {
						loader: "sass-loader",
						options: {
							sourceMap: true,
							functions: {
								"get($keys)" : getSassKey
							}
						}
					}
				]
			}, {
				test: /\.(svg|woff2?|ttf|eot)(\?.*)?$/i,
				use: "file-loader"
			}, {
				test: /\.(jpe?g|png|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192
						}
					}
				]
			}, {
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: true,
							removeComments: false,
							collapseWhitespace: false
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: [".jsx", ".js", ".json", ".less", ".scss", ".css", ".html"],
		alias: {
			modules: path.resolve(__dirname, "src/modules"), // used for tests
			style: path.resolve(__dirname, "src/style"),
			core: path.resolve(__dirname, "src/core"),
			"~": path.resolve(__dirname, "src") // root
		}
	},
	devtool: 'source-map',
	plugins: [
		new DefinePlugin({
			__UAT__: isUat ? 'true' : 'false',
			__PRD__: argv.mode === 'production' && !isUat ? 'true' : 'false',
			__BASEFONT__: JSON.stringify(sassVars.basefont),
			__UIWIDTH__: JSON.stringify(sassVars.width)
		}),
		new HtmlWebpackPlugin({
			minify: {
				collapseWhitespace: true
			},
			hash : true,
			template: './src/index.html'
		}),
		new CopyWebpackPlugin([
			{ from: './src/prizes1.js', to: './prizes1.js' },
			{ from: './src/prizes2.js', to: './prizes2.js' },
			{ from: './src/themedata1.js', to: './themedata1.js' },
			{ from: './src/themedata2.js', to: './themedata2.js' },
			{ from: './src/assets', to: './assets' }
		])
		// new MiniCssExtractPlugin({
		// 	// Options similar to the same options in webpackOptions.output both options are
		// 	// optional
		// 	filename: "[name].css",
		// 	chunkFilename: "[id].css"
		// })
	],
	optimization: {
		minimizer: [
			new UglifyJsPlugin({ sourceMap: true }),
			new OptimizeCSSAssetsPlugin({})
		]
	},
	devServer: {
		contentBase: path.join(__dirname, 'src'),
		compress: true,
		port: 9000,
		host: '0.0.0.0',
		publicPath: '/',
		historyApiFallback: true,
		proxy: {
			"/mf": {
				target: "http://wx-test1.by-health.com",
				changeOrigin: true
			}
		  }
	}
});
