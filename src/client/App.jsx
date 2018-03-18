import _                                  from 'underscore'
import React, { Component }               from 'react'
import io                                 from 'socket.io-client'
import PropTypes                          from 'prop-types';
import { withStyles }                     from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import AppBar                             from 'material-ui/AppBar'
import Toolbar                            from 'material-ui/Toolbar'
import Button                             from 'material-ui/Button'
import Paper                              from 'material-ui/Paper'
import Typography                         from 'material-ui/Typography'
import Grid                               from 'material-ui/Grid'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import ArrowUpward                        from 'material-ui-icons/ArrowUpward'
import ArrowDownward                      from 'material-ui-icons/ArrowDownward'
import PowerSettingsNew                   from 'material-ui-icons/PowerSettingsNew'

import './style.css'
import QueueMeter from './QueueMeter'

const styles = theme => ({
  // root: {
    // flexGrow: 1,
  // },

  content: {
    padding: "16px",
  },

  queueCard: {
    height: '500px',
  },

  queueCardList: {
    overflowY: 'scroll',
    height: '440px',
    marginLeft: '-24px',
  },
})

const QueueListItem = ({ type }) => {
  let component = <PowerSettingsNew />
  if (type === 'home') component = <ArrowUpward />
  if (type === 'open') component = <ArrowDownward />

  return (
    <ListItemIcon>
      { component }
    </ListItemIcon>
  )
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      data: 'yolo',
      queue: {},
      sockets: 0,
      send: false,
    }

    this.throttledUpdate = _.throttle(this.updateState, 1000)
  }

  componentDidMount() {
    this.mounted = true
    this.socket  = io.connect()

    this.socket.once('connect', () => {
      console.log('connected')
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
    const btnStyle = { marginRight: '8px' }
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Teh awesome Lamp Server
            </Typography>
          </Toolbar>
        </AppBar>

        <div className={classes.content}>
          <Grid container spacing={16} direction={"row"}>

            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary">
                    Lamp Control!
                  </Typography>

                  <Typography variant="headline" component="h2">
                    Choose a movement
                  </Typography>
                </CardContent>

                <CardActions>
                  {
                    _.map([ 'home', 'open', 'release' ], (movement) => (
                      <Button
                        key     = { `movement-button-${movement}` }
                        size    = "small"
                        onClick = {this.movement.bind(this, movement)}>
                        { movement }
                      </Button>
                    ))
                  }
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary">
                    Sockets connected
                  </Typography>

                  <Typography variant="headline" component="h2">
                    { this.state.sockets }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card className={ classes.queueCard }>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary">
                    Queue: { this.state.queue.length }
                  </Typography>

                  <List className={classes.queueCardList} component="nav">
                    {
                      _.map(this.state.queue, (task, i) => (
                        <ListItem key={ `queue-list-${i}` }>
                          <QueueListItem type={ task.movement } />
                          <ListItemText
                            primary={ task.movement }
                          />
                        </ListItem>
                      ))
                    }
                  </List>

                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </div>

      </div>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App)
