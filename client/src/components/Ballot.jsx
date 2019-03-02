import React, { useState, useEffect } from 'react'

const Ballot = ({ web3, accounts, contract, id }) => {
  const [name, setName] = useState('')
  const [proposals, setProposals] = useState({})
  const [selectedProposalIndex, setSelectedProposalIndex] = useState(0)
  const [hasBeenVoted, setHasBeenVoted] = useState(false)


  // const vote = async () => {
  //   const voter = accounts[0]
  //   const gas = 500000

  //   const canVote = await contract.methods.canVote('0', voter).call()
  //   if (canVote) {
  //     const ballot = await contract.methods.ballots('0').call()
  //     const proposalVoteCount = await contract.methods
  //       .proposalVoteCount('0', '0')
  //       .call()
  //     await contract.methods.vote(0, 0).send({ from: voter, gas })
  //     const ballotAfter = await contract.methods.ballots('0').call()
  //     const proposalVoteCountAfter = await contract.methods
  //       .proposalVoteCount('0', '0')
  //       .call()
  //     console.log({
  //       ballot,
  //       ballotAfter,
  //       proposalVoteCount,
  //       proposalVoteCountAfter,
  //     })
  //   } else {
  //     console.log('Cannot vote')
  //   }
  // }

  const onBallotAdded = event => setName(event.returnValues.name)
  const onBallotProposalDefined = event => {
    const { proposalName, proposalId } = event.returnValues
    console.log({ proposalId })
    setProposals((prev) => ({ ...prev, [proposalId]: proposalName }))
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
  }, [])

  return <div>{name} {Object.values(proposals).join(' ')}</div>
}

export default Ballot
