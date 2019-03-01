import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Identicon from 'identicon.js'
import { format } from 'date-fns'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
})

const BallotList = ({ classes, web3, accounts, contract }) => {
  const [ballots, setBallots] = useState({})

  const onBallotAdded = event => {
    console.log(event)
    const { blockNumber, returnValues, transactionHash: hash } = event
    const { id, creator, proposalCount, name } = returnValues

    web3.eth.getBlock(blockNumber).then(({ timestamp }) => {
      setBallots(prev => ({
        ...prev,
        [id]: { creator, name, timestamp, proposalCount, hash },
      }))
    })
  }

  useEffect(() => {
    const { BallotAdded } = contract.events
    const filter = {
      fromBlock: 0,
      toBlock: 'latest',
    }

    const ballotAddedEmiter = BallotAdded(filter)

    ballotAddedEmiter.on('data', onBallotAdded)
  }, [])

  return (
    <List className={classes.root}>
      {Object.entries(ballots).map(([key, { hash, name, timestamp }]) => (
        <ListItem {...{ key }}>
          <Avatar style={{ borderRadius: 0 }}>
            <img src={'data:image/png;base64,' + new Identicon(hash)} />
          </Avatar>
          <ListItemText
            primary={name}
            secondary={format(new Date(timestamp * 1000), 'MMM d, yyyy | hh:mm')}
          />
        </ListItem>
      ))}
    </List>
  )
}

export default withStyles(styles)(BallotList)
