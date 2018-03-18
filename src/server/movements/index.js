const { spawn } = require('child_process')

module.exports = {
  open:    cb => spawn('python', [ 'open.py' ]).on('close', () => setTimeout(cb, 5000)),

  home:    cb => spawn('python', [ 'home.py' ]).on('close', () => setTimeout(cb, 5000)),

  release: cb => spawn('python', [ 'release.py' ]).on('close', () => setTimeout(cb, 5000)),
}
