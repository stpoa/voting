import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  withStyles,
} from '@material-ui/core'
import { defineBallotProposal, addBallot, begin } from '../lib/voting';

const BallotCreate = ({ classes, web3, accounts, contract }) => {
  const [addBallotDialogOpen, setAddBallotDialogOpen] = useState(false)
  const [proposals, setProposals] = useState({ 0: '' })

  const handleAddBallotSubmit = async e => {
    e.preventDefault()
    const config = { contract, gas: 500000, from: accounts[0] }
    const [name, ...rest] = [...e.target.elements].map(e => e.value)
    const proposalNames = rest.filter(n => n.length)

    setProposals({ 0: '' })
    setAddBallotDialogOpen(false)

    const addBallotResult = await addBallot(config)({
      name,
      proposalCount: proposalNames.length + '',
      voters: accounts,
    })

    const ballotId = addBallotResult.events.BallotAdded.returnValues.id
    await Promise.all(
      proposalNames.map((proposalName, i) =>
        defineBallotProposal(config)({ ballotId, proposalId: i, proposalName }),
      ),
    )
    await begin(config)({ ballotId })
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

  return (
    <>
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
      <Button variant="outlined" color="primary" onClick={handleAddBallotBtn}>
        Add ballot
      </Button>
    </>
  )
}

const styles = {}

export default withStyles(styles)(BallotCreate)
