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
