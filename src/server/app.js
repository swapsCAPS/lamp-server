const _                    = require('underscore')
const path                 = require('path')
const express              = require('express')
const webpack              = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const cookieParser         = require('cookie-parser')
const bodyParser           = require('body-parser')
const http                 = require('http')
const sio                  = require('socket.io')
const log                  = require('winston')
const async                = require('async')

const webpackConfig = require('../../webpack.dev.js')
let   movements     = require('./movements')

if (process.env.NODE_ENV !== 'production') {
  log.warn('Using fake movements')
  movements = _.mapObject(movements, () => (cb) => setTimeout(cb, 2500) )
}

const compiler = webpack(webpackConfig)
const app      = express()
const server   = http.Server(app)
const io       = sio(server)
const sockets  = {}

const announce = (data) => {
  _.each(sockets, socket => socket.emit('data', data))
}

const todo = queue => (
  queue
    .workersList()
    .map((w) => w.data)
    .concat(queue._tasks.toArray())
)

const queue = async.queue((task, cb) => {
  log.info(`starting task! ${JSON.stringify(task)}`)
  announce({ queue: todo(queue) })

  movements[task.movement]((code) => {
    announce({ queue: todo(queue) })

    if (code !== 0) {
      log.error(`Movement came back with exit code ${code}`)
    }

    cb()
  })

}, 1)

queue.drain = () => {
  log.info('The queue has been drained')
  announce({ queue: todo(queue) })
}

queue.pushAndNotify = (task) => {
  queue.push(task)
  return announce({ queue: todo(queue) })
}

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

server.listen(3000, () => {
  log.info('http server listening')
})

io.on('connection', (socket) => {
  sockets[socket.id] = socket
  log.info(`socket with ${socket.id} connected : ) now ${_.keys(sockets).length}`)

  announce({ sockets: _.keys(sockets).length, queue: todo(queue) })

  socket.on('data', (data) => {
    if (!_.contains(_.keys(movements), data.movement)) {
      return log.warn('Incorrect command')
    }
    if (queue.length() >= 10) {
      return log.info(`The queue is too large, ${data.data} will not be processed`)
    }

    log.info(`pushing task ${data.movement}`)
    return queue.pushAndNotify(data)
  })

  const interval = setInterval(() => {
    socket.emit('data', { date: new Date() })
  }, 1000)

  socket.once('disconnect', () => {
    delete sockets[socket.id]
    log.info(`socket with ${socket.id} disconnected : ( ${_.keys(sockets).length} left`)
    announce({ sockets: _.keys(sockets).length })
    clearInterval(interval)
  })
})
