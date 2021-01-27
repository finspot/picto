const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

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
    chunkFilename: 'static/[name].chunk.js',
    filename: 'static/[name].bundle.js',
    path: path.join(__dirname, 'public'),
    publicPath: '/',
  },

  plugins: [new BundleAnalyzerPlugin(), new HtmlWebpackPlugin()],

  stats: 'errors-warning',
}
