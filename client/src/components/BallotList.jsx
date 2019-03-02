import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Identicon from 'identicon.js'
import { format } from 'date-fns'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
} from '@material-ui/core'

const addBallot = ({ contract, gas, from }) => async ({
  name,
  proposalCount,
  voters,
}) => {
  return contract.methods
    .addBallot(name, proposalCount + '', voters)
    .send({ from, gas })
}

const defineBallotProposal = ({ contract, gas, from }) => async ({
  ballotId,
  proposalId,
  proposalName,
}) => {
  return contract.methods
    .defineBallotProposal(ballotId + '', proposalId + '', proposalName)
    .send({ from, gas })
}

const BallotList = ({ classes, web3, accounts, contract }) => {
  const [ballots, setBallots] = useState({})
  const [addBallotDialogOpen, setAddBallotDialogOpen] = useState(false)
  const [proposals, setProposals] = useState({ 0: '' })
  const config = { contract, gas: 500000, from: accounts[0] }

  const handleDefineBallotProposal = async () => {
    const result = await defineBallotProposal(config)({
      ballotId: 0 + '',
      proposalId: 0 + '',
      proposalName: 'Test proposal 1',
    })
    console.log({ result })
  }

  /* Handlers */

  const handleAddBallotSubmit = async e => {
    console.log('handle add ballot submit')
    e.preventDefault()
    const [name, ...rest] = [...e.target.elements].map(e => e.value)
    const proposalNames = rest.filter(n => n.length)

    console.log({ name, proposalNames, rest })
    setProposals({ 0: '' })
    setAddBallotDialogOpen(false)
    const addBallotResult = await addBallot(config)({
      name,
      proposalCount: proposalNames.length + '',
      voters: accounts,
    })
    console.log({ addBallotResult })
    const ballotId = addBallotResult.events.BallotAdded.returnValues.id

    await Promise.all(
      proposalNames.map((proposalName, i) =>
        defineBallotProposal(config)({ ballotId, proposalId: i, proposalName }),
      ),
    )

  }

  const handleAddBallotCancel = () => {
    setAddBallotDialogOpen(false)
  }

  const handleAddBallotBtn = () => {
    setAddBallotDialogOpen(true)
  }

  const handleProposalChange = key => e => {
    const proposal = e.target.value

    setProposals(proposals => {
      const nextKey = Number(key) + 1
      const nextVal = proposals[nextKey] || ''

      return { ...proposals, [key]: proposal, [nextKey]: nextVal }
    })
  }

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
    <div>
      <List className={classes.root}>
        {Object.entries(ballots).map(([key, { hash, name, timestamp }]) => (
          <ListItem {...{ key }}>
            <Avatar style={{ borderRadius: 0 }}>
              <img src={'data:image/png;base64,' + new Identicon(hash)} />
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
      <Button variant="outlined" color="primary" onClick={handleAddBallotBtn}>
        Add ballot
      </Button>

      <Dialog
        open={addBallotDialogOpen}
        onClose={handleAddBallotCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create ballot</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create new ballot, please fill information below. You will have
            to send more than one transaction.
          </DialogContentText>
          <form id="create-ballot-form" onSubmit={handleAddBallotSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Ballot name"
              fullWidth
            />
            {Object.entries(proposals).map(([key, proposal]) => {
              const num = Number(key) + 1

              return (
                <TextField
                  key={key}
                  onChange={handleProposalChange(key)}
                  value={proposal}
                  margin="dense"
                  id={'proposal-' + num}
                  name={'proposal-' + num}
                  label={'Proposal ' + num}
                  fullWidth
                />
              )
            })}
          </form>
        </DialogContent>
        <Button onClick={handleAddBallotCancel} color="primary">
          Cancel
        </Button>
        <Button form="create-ballot-form" type="submit" color="primary">
          Create ballot
        </Button>
      </Dialog>
    </div>
  )
}

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
})

export default withStyles(styles)(BallotList)
