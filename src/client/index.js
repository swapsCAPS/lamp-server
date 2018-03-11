// TODO
// React app using sockets to display and update on lamp state
//


import _ from 'underscore'
import Shrug from './shrug.png'
import './style.css'
import printMe from './print'

function component() {
  const element  = document.createElement('div')
  const imgshrug = new Image()
  const btn      = document.createElement('button')

  element.innerHTML = _.map([ 'man', 'swek' ], d => `woot ${d}`)
  element.classList.add('hello')

  imgshrug.src = Shrug

  element.appendChild(imgshrug)

  btn.innerHTML = 'Je mama'
  btn.onclick   = printMe

  element.appendChild(btn)

  return element
}

document.body.appendChild(component())

if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated printMe module!')
    printMe()
  })
}
