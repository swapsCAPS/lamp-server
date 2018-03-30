const { spawn } = require('child_process')

module.exports = {
  open:    cb => spawn('python', [ 'close.py' ]).on('close', cb),

  home:    cb => spawn('python', [ 'open.py' ]).on('close', cb),

  release: cb => spawn('python', [ 'release.py' ]).on('close', cb),
}
