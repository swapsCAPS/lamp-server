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
      let index = 0

      this.socket.emit('data', { action: 'doSomething', data: index })
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
    console.log('data', data)
    this.setState(data)
  }

  toggleSending()  {
    this.setState((prevState) => {
      return {
        send: !prevState.send
      }
    })
  }

  render() {
    return (
      <div>
        <div className="hello">{ this.state.date }</div>
        <QueueMeter
          queueLength = { this.state.queueLength }
        />
        <button onClick={ this.toggleSending.bind(this) }>{ `send: ${ this.state.send }` }</button>
      </div>
    )
  }
}
