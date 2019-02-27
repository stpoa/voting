import React, { useState, useEffect } from 'react'

const replaceAtIndex = (arr, index, value) => [
  ...arr.slice(0, index),
  value,
  ...arr.slice(index + 1),
]

const Ballot = ({ web3, accounts, contract, id }) => {
  const [name, setName] = useState('')
  const [proposals, setProposals] = useState([])
  const [selectedProposalIndex, setSelectedProposalIndex] = useState(0)
  const [hasBeenVoted, setHasBeenVoted] = useState(false)

  const onBallotAdded = event => setName(event.returnValues.name)
  const onBallotProposalDefined = event => {
    const { proposalName, proposalId } = event.returnValues
    const newProposals = replaceAtIndex(proposals, proposalId, proposalName)
    setProposals(newProposals)
  }

  useEffect(() => {
    const { BallotAdded, BallotProposalDefined } = contract.events
    const idFilter = {
      fromBlock: 0,
      toBlock: 'latest',
      filter: { ballotId: id },
    }

    const ballotAddedEmiter = BallotAdded(idFilter)
    const ballotProposalDefinedEmiter = BallotProposalDefined(idFilter)

    ballotAddedEmiter.on('data', onBallotAdded)
    ballotProposalDefinedEmiter.on('data', onBallotProposalDefined)
  }, [name, proposals])

  return <div>{name} {proposals.join(' ')}</div>
}

export default Ballot
