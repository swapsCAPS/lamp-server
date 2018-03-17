import React, { Component } from 'react'

export default class QueueMeter extends Component {
  render() {
    return (
      <div className="queue-meter">{ this.props.queueLength }</div>
    )
  }
}

