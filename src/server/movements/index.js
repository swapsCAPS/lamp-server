const { spawn } = require('child_process')

module.exports = {
  close:    cb => spawn('python', [ `${__dirname}/close.py` ]).on('close', cb),

  open:    cb => spawn('python', [ `${__dirname}/open.py` ]).on('close', cb),

  release: cb => spawn('python', [ `${__dirname}/release.py` ]).on('close', cb),
}
