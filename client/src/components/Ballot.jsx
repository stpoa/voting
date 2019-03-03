import React, { useState, useEffect } from 'react'
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  withStyles,
  Button,
  Dialog,
  Typography,
} from '@material-ui/core'
import { vote } from '../lib/voting'

const Ballot = ({
  accounts,
  contract,
  ballot: { name, id: ballotId },
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
    setProposals(prev => ({ ...prev, [proposalId]: proposalName }))
  }
  const onVoted = event => {
    setHasBeenVoted(true)
    const num = event.returnValues.proposalNumber
    setProposalNumber(Number(num))
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
      open={ballotOpen}
      onClose={handleBallotClose}
      aria-labelledby="form-dialog-title"
    >
      <Typography variant="h4">{name}</Typography>

      <FormControl
        onSubmit={handleVoteSubmit}
        component="form"
        className={classes.formControl}
      >
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup
          aria-label="Gender"
          name="gender1"
          className={classes.group}
          value={proposalNumber + ''}
          onChange={handleVoteSelect}
        >
          {Object.entries(proposals).map(([proposalId, proposalName]) => (
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
    </Dialog>
  )
}

const styles = {}

export default withStyles(styles)(Ballot)
