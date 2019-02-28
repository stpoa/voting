import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});


const BallotList = ({ classes, web3, accounts, contract }) => {
  const [ballots, setBallots] = useState({})

  const onBallotAdded = event => {
    const { name, ballotId } = event.returnValues

    return setBallots((prev) => ({...prev, [ballotId]: name }))
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


  console.log(ballots)

  return (
    <List className={classes.root}>
    {Object.entries(ballots).map(([key, name]) => (
      <ListItem {...{key}}>
        <Avatar>
          <ImageIcon />
        </Avatar>
        <ListItemText primary={name} secondary="Jan 9, 2014" />
      </ListItem>
    ))}
    </List>
  );
}

export default withStyles(styles)(BallotList);
