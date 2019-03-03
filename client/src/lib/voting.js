export const addBallot = ({ contract, gas, from }) => async ({
  name,
  proposalCount,
  voters,
}) => {
  return contract.methods
    .addBallot(name, proposalCount + '', voters)
    .send({ from, gas })
}

export const defineBallotProposal = ({ contract, gas, from }) => async ({
  ballotId,
  proposalId,
  proposalName,
}) => {
  return contract.methods
    .defineBallotProposal(ballotId + '', proposalId + '', proposalName)
    .send({ from, gas })
}

export const begin = ({ contract, gas, from }) => async ({ ballotId }) => {
  return contract.methods.begin(ballotId + '').send({ from, gas })
}

export const vote = ({ contract, gas, from }) => async ({
  ballotId,
  proposalNumber,
}) => {
  return contract.methods
    .vote(ballotId + '', proposalNumber + '')
    .send({ from, gas })
}

// const canVote = await contract.methods.canVote(ballotId + '', from).call()
// if (canVote) {
// } else {
// console.log('Cannot vote')
// }

// const ballot = await contract.methods.ballots(ballotId + '').call()

// const proposalVoteCount = await contract.methods
//   .proposalVoteCount(ballotId + '', '0')
//   .call()

// const ballotAfter = await contract.methods.ballots('0').call()
