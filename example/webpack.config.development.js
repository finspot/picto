const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true,
    hot: true,
    port: 8765,
  },

  devtool: 'eval',

  entry: path.join(__dirname, 'src/index'),

  mode: 'development',

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

  output: {
    chunkFilename: 'static/[name].chunk.js',
    filename: 'static/[name].bundle.js',
    path: path.join(__dirname, 'public'),
    publicPath: '/',
  },

  plugins: [new HtmlWebpackPlugin()],

  stats: 'errors-warning',
}
