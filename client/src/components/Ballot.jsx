import React, { useState, useEffect } from 'react'
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  withStyles,
  Button,
  Dialog,
  Typography,
  Divider,
} from '@material-ui/core'
import { vote } from '../lib/voting'
import { Identicon } from './Identicon'
import Results from './Results'

const Ballot = ({
  accounts,
  contract,
  ballot: { name, id: ballotId, hash },
  ballotOpen,
  handleBallotClose,
  classes,
}) => {
  const config = { contract, gas: 500000, from: accounts[0] }

  const [proposals, setProposals] = useState({})
  const [proposalNumber, setProposalNumber] = useState(null)
  const [hasBeenVoted, setHasBeenVoted] = useState(false)
  const resetWholeState = () => {
    setProposals({})
    setHasBeenVoted(false)
    setProposalNumber(null)
  }

  const onBallotProposalDefined = event => {
    const { proposalName, proposalId } = event.returnValues
    setProposals(prev => ({
      ...prev,
      [proposalId]: { proposalName, votes: 0 },
    }))
  }
  const onVoted = event => {
    const { voter, proposalNumber } = event.returnValues
    if (voter === accounts[0]) {
      setProposalNumber(proposalNumber)
      setHasBeenVoted(true)
    }
    setProposals(prev => {
      const previous = prev[proposalNumber]
      const votes = previous.votes + 1

      return { ...prev, [proposalNumber]: { ...previous, votes } }
    })
  }
  useEffect(() => {
    resetWholeState()

    const { BallotProposalDefined, Voted } = contract.events
    const idFilter = {
      fromBlock: 0,
      toBlock: 'latest',
      filter: { ballotId },
    }
    const ballotProposalDefinedEmiter = BallotProposalDefined(idFilter)
    const votedEmiter = Voted({ ...idFilter, voter: config.from })

    ballotProposalDefinedEmiter.on('data', onBallotProposalDefined)
    votedEmiter.on('data', onVoted)

    return () => {
      ballotProposalDefinedEmiter.unsubscribe()
      votedEmiter.unsubscribe()
    }
  }, [ballotId])

  const handleVoteSelect = e => {
    const { value } = e.target
    setProposalNumber(value)
  }
  const handleVoteSubmit = e => {
    e.preventDefault()

    vote(config)({ ballotId, proposalNumber })
    setHasBeenVoted(true)
  }

  return (
    <Dialog
      classes={{
        paper: classes.paper,
        container: classes.container,
        root: classes.root,
      }}
      open={ballotOpen}
      onClose={handleBallotClose}
      aria-labelledby="form-dialog-title"
    >
      <div style={{ minHeight: '100px', marginBottom: '1rem' }}>
        <Identicon
          style={{ float: 'left', marginRight: '1rem' }}
          value={hash}
        />
        <Typography component="div" style={{ display: 'inline' }} variant="h5">
          {name}
        </Typography>
      </div>
      <Divider />

      {!hasBeenVoted ? (
        <FormControl
          onSubmit={handleVoteSubmit}
          component="form"
          className={classes.formControl}
        >
          <RadioGroup
            aria-label="Gender"
            name="gender1"
            className={classes.group}
            value={proposalNumber + ''}
            onChange={handleVoteSelect}
          >
            {Object.entries(proposals).map(([proposalId, { proposalName }]) => (
              <FormControlLabel
                disabled={hasBeenVoted}
                key={proposalId}
                value={proposalId}
                control={<Radio />}
                label={proposalName}
              />
            ))}
          </RadioGroup>
          <Button
            disabled={proposalNumber === null || hasBeenVoted}
            variant="outlined"
            color="primary"
            type="submit"
          >
            Vote
          </Button>
        </FormControl>
      ) : (
        <Results {...{ proposals, name, proposalNumber }} />
      )}
    </Dialog>
  )
}

const styles = {
  paper: {
    display: 'block',
    padding: '1rem',
    margin: '1rem',
    width: '100vw',
  },
  group: {
    marginTop: '1rem',
    marginBottom: '1rem',
    marginLeft: '0.5rem',
  },
  container: {},
  root: {},
}

export default withStyles(styles)(Ballot)
