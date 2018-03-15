const path                 = require('path')
const express              = require('express')
const webpack              = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const cookieParser         = require('cookie-parser');
const bodyParser           = require('body-parser');

const webpackConfig        = require('../../webpack.dev.js')

const app = express()
const compiler = webpack(webpackConfig)

app
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'pug')
  .use(webpackDevMiddleware(compiler, {
  // noInfo:     true,
    publicPath: webpackConfig.output.publicPath,
  }))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .use(express.static(path.join(__dirname, 'public')))
  .use(require('webpack-hot-middleware')(compiler))
  .get('/', (req, res) => {
    res.render('index')
  })


app.listen(3000, () => {
  console.log('listening')
})
