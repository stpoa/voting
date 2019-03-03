import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import { format } from 'date-fns'
import { Identicon } from './Identicon';

const BallotList = ({ classes, web3, contract, handleBallotClick }) => {
  const [ballots, setBallots] = useState({})

  const onBallotAdded = event => {
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
        <ListItem
          button
          onClick={handleBallotClick({ id: key, hash, name, timestamp })}
          {...{ key }}
        >
          <Avatar style={{ borderRadius: 0 }}>
            <Identicon value={hash} width={40} height={40} />
          </Avatar>
          <ListItemText
            primary={name}
            secondary={format(
              new Date(timestamp * 1000),
              'MMM d, yyyy | hh:mm',
            )}
          />
        </ListItem>
      ))}
    </List>
  )
}

const styles = theme => ({
  root: {
    width: 'calc(100% - 4rem)',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    backgroundColor: theme.palette.background.paper,
  },
})

export default withStyles(styles)(BallotList)
