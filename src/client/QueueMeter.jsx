import React, { Component } from 'react'

export default class QueueMeter extends Component {
  render() {
    return (
      <div>
        <div className="queue-meter">{ JSON.stringify(this.props.queue) }</div>
      </div>
    )
  }
}

