const { spawn } = require('child_process')

module.exports = {
  close:    cb => spawn('python', [ 'close.py' ]).on('close', cb),

  open:    cb => spawn('python', [ 'open.py' ]).on('close', cb),

  release: cb => spawn('python', [ 'release.py' ]).on('close', cb),
}
