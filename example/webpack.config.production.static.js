const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')

const pkg = require('../package.json')
const browserConfig = require('./webpack.config.production.browser.js')

const title = `${pkg.name} (v${pkg.version})`

module.exports = [
  {
    ...browserConfig,

    plugins: [
      new webpack.EnvironmentPlugin({
        TITLE: title,
      }),

      new WebpackManifestPlugin({
        fileName: path.join(__dirname, '.bin/manifest.json'),
        publicPath: '',
      }),

      ...(process.env.ANALYSE === 'true' ? [new BundleAnalyzerPlugin()] : []),
    ],
  },
  {
    entry: path.join(__dirname, 'src/index.static'),

    mode: 'production',

    module: {
      rules: [
        {
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
          test: /\.tsx?$/,
        },
      ],
    },

    output: {
      filename: 'index.js',
      path: path.join(__dirname, '.bin'),
    },

    plugins: [
      new webpack.EnvironmentPlugin({
        TITLE: title,
      }),
    ],

    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },

    target: 'node',

    stats: 'errors-warning',
  },
]
