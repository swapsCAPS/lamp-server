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

  btn.innerHTML = 'Fuck yeah!'
  btn.onclick   = printMe

  element.appendChild(btn)

  return element
}

document.body.appendChild(component())
