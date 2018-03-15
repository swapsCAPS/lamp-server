const express              = require('express')
const webpack              = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const webpackConfig        = require('../../webpack.dev.js')

const app = express()
const compiler = webpack(webpackConfig)

app
  .use(webpackDevMiddleware(compiler, {
  // noInfo:     true,
    publicPath: webpackConfig.output.publicPath,
  }))
  .use(require('webpack-hot-middleware')(compiler))


app.listen(3000, () => {
  console.log('listening')
})
