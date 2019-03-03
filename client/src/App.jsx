import React from 'react'
import {
  Typography,
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core'
import './App.css'
import Dapp from './Dapp'

const App = ({ classes }) => {
  const theme = createMuiTheme({
    palette: {
      type: 'light',
    },
  })

  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <header className={classes.header}>
          <Typography
            style={{ fontFamily: 'Dancing Script, cursive', fontSize: '24px' }}
            variant="h2"
            color="primary"
          >
            Voting Dapp
          </Typography>
        </header>
        <Dapp />
      </div>
    </MuiThemeProvider>
  )
}

const styles = {
  header: {
    margin: '0.5rem',
  },
}

export default withStyles(styles)(App)
