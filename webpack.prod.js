const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = webpackMerge(common, {
  entry: {
    app: [ './src/client/index.jsx' ],
  },

  devtool: 'inline-source-map',

  mode: 'production',

  plugins: [
    new UglifyJSPlugin({ sourceMap: true }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  ],

})
