const _                    = require('underscore')
const path                 = require('path')
const express              = require('express')
const webpack              = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const cookieParser         = require('cookie-parser')
const bodyParser           = require('body-parser')
const { Server }           = require('http')
const sio                  = require('socket.io')
const log                  = require('winston')
const async                = require('async')

const webpackConfig        = require('../../webpack.dev.js')

const app    = express()
const server = Server(app)
const io     = sio(server)

const compiler = webpack(webpackConfig)

const sockets = {}

const actionMap = {
  doSomething: (data, cb) => {
    setTimeout(() => {
      log.info(`finished task '${data}'`)
      cb()
    }, 1000)
  },
}

const queue = async.queue((task, cb) => {
  log.info(`starting task! ${JSON.stringify(task)}`)
  actionMap[task.action](task.data, cb)
}, 1)

queue.drain = () => {
  log.info('The queue has been drained')
  announce({ queueLength: queue.length() })
}

app
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'pug')
  .use(webpackDevMiddleware(compiler, {
    noInfo:     true,
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


server.listen(3000, () => {
  log.info('http server listening')
})

const announce = (data) => {
  _.each(sockets, socket => socket.emit('data', data))
}

io.on('connection', socket => {
  sockets[socket.id] = socket
  log.info(`socket with ${socket.id} connected : ) now ${_.keys(sockets).length}`)

  announce({ queueLength: queue.length() })

  socket.on('data', data => {
    if (queue.length() >= 10) {
      log.info(`Sorry, the queue is too large, ${data.data} will not be processed`)
      return
    }

    log.info(`pushing task ${data.data}`)
    queue.push(data)
    announce({ queueLength: queue.length() })
  })

  const interval = setInterval(() => {
    socket.emit('data', { date: new Date() })
  }, 1000)

  socket.once('disconnect', () => {
    delete sockets[socket.id]
    log.info(`socket with ${socket.id} disconnected : ( ${_.keys(sockets).length} left`)
    clearInterval(interval)
  })
})
