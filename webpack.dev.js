const path               = require('path')
const webpack            = require('webpack')
const webpackMerge       = require('webpack-merge')
const common             = require('./webpack.common')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = webpackMerge(common, {
  entry: {
    app: [ './src/client/index.jsx', 'webpack-hot-middleware/client' ],
  },

  mode: 'development',

  plugins: [
    new CleanWebpackPlugin([ 'dist' ]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],

})
