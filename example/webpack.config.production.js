const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const pkg = require('../package.json')

const title = `${pkg.name} (v${pkg.version})`

module.exports = {
  entry: path.join(__dirname, 'src/index'),

  mode: 'production',

  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
        test: /\.js$/,
      },
    ],
  },

  optimization: {
    minimizer: [new TerserPlugin()],
  },

  output: {
    chunkFilename: 'static/[name].[contenthash:8].chunk.js',
    filename: 'static/[name].[contenthash:8].bundle.js',
    path: path.join(__dirname, 'public'),
    publicPath: '/',
  },

  plugins: [
    new HtmlWebpackPlugin({ title }),

    new webpack.EnvironmentPlugin({
      TITLE: title,
    }),
  ],

  stats: 'errors-warning',
}

if (process.env.ANALYSE === 'true') {
  module.exports.plugins.push(new BundleAnalyzerPlugin())
}
