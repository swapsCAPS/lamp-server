import React    from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { hot }  from 'react-hot-loader'
import amber from 'material-ui/colors/amber';
import lightGreen from 'material-ui/colors/lightGreen';
import CssBaseline from 'material-ui/CssBaseline';
import 'typeface-roboto'

import App from './App'

const theme = createMuiTheme({
  palette: {
    primary: amber,
    secondary: lightGreen,
  },
  status: {
    danger: 'orange',
  },
});

const Root = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </MuiThemeProvider>
)

ReactDOM.render(<Root />, document.getElementById('root'))

export default hot(module)(App)
