import _                    from 'underscore'
import React, { Component } from 'react'
import io                   from 'socket.io-client'

import './style.css'
import QueueMeter from './QueueMeter'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      data: 'yolo',
      queueLength: 0,
      send: false,
    }

    this.throttledUpdate = _.throttle(this.updateState, 1000)
  }

  componentDidMount() {
    this.mounted = true
    this.socket  = io.connect()

    this.socket.once('connect', () => {
      console.log('connected')

      this.socket.emit('data', { movement: 'home' })
      this.socket.emit('data', { movement: 'open' })
      this.socket.emit('data', { movement: 'release' })
    })

    this.socket.on('data', this.updateState.bind(this))
  }

  componentWillUnmount() {
    this.mounted = false
    this.socket.off('data', this.updateState.bind(this))
    this.socket.close()
  }

  updateState(data) {
    if (!this.mounted) return
    this.setState(data)
  }

  movement(type)  {
    console.log('type', type)
    this.socket.emit('data', { movement: type })
  }

  render() {
    return (
      <div>
        <div className="hello">{ this.state.date }</div>
        <QueueMeter
          queue={this.state.queue}
        />
        <button onClick={this.movement.bind(this, 'home')}>home</button>
        <button onClick={this.movement.bind(this, 'open')}>open</button>
        <button onClick={this.movement.bind(this, 'release')}>release</button>
      </div>
    )
  }
}
