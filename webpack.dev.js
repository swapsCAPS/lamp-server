const path         = require('path')
const webpack      = require('webpack')
const webpackMerge = require('webpack-merge')
const common       = require('./webpack.common')

module.exports = webpackMerge(common, {
  entry: {
    app: [ './src/client/index.js', 'webpack-hot-middleware/client' ],
  },

  mode: 'development',

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],

})
