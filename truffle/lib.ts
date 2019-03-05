import { VotingInstance } from './types/truffle-contracts'

interface CreateBallotProps {
  name: string
  voters: string[]
  proposals: [string, ...string[]][]
}

export const createBallot = (voting: VotingInstance) => async (
  props: CreateBallotProps,
) => {
  const { name, voters, proposals } = props
  const proposalCount = proposals.length

  const result = await voting.addBallot(name, proposalCount, voters)
  const ballotId: string = result.logs[0].args.id

  await Promise.all(
    proposals.map(async ([proposal], i) => {
      await voting.defineBallotProposal(ballotId, i, proposal)
    }),
  )

  await voting.begin(ballotId)

  await Promise.all(
    proposals.map(([_, ...voters], i) =>
      Promise.all(
        voters.map(voter => voting.vote(ballotId, i, { from: voter })),
      ),
    ),
  )
}
