import { assert } from 'chai'
import { findLast, propEq } from 'ramda'

const VotingContract = artifacts.require('Voting')

const assertPromiseRejected = (p: Promise<any>) => {
  p.then(() => assert.fail()).catch(e => {
    expect(e).to.exist.and.be.instanceOf(Error)
  })
}

const getEventFromLogs = (logs: any[], eventName: string) =>
  findLast(propEq('event', eventName))(logs)

contract('Voting', accounts => {
  // Accounts
  const CREATOR = accounts[0]
  const VOTERS = [1, 2, 3, 4, 5].map(v => accounts[v])
  const NOT_VOTERS = [6, 7, 8, 9].map(v => accounts[v])
  // Proposals
  const MAX_PROPOSALS_COUNT = 100

  it('initiates voting contract', async () => {
    const instance = await VotingContract.new()
    assert.ok(instance)
  })

  it('gets not existing ballot', async () => {
    const instance = await VotingContract.new()
    const ballot = await instance.ballots(0)

    const [id, creator, count] = ballot

    assert.equal(id + '', 0 + '')
    assert.equal(creator, '0x0000000000000000000000000000000000000000')
    assert.equal(count + '', 0 + '')
  })

  it(`throws when number of proposals larger than ${MAX_PROPOSALS_COUNT}`, async () => {
    const toManyProposals = MAX_PROPOSALS_COUNT + 1
    const instance = await VotingContract.new()

    await assertPromiseRejected(
      instance.addBallot('Test ballot', toManyProposals, VOTERS),
    )
  })

  it('adds a ballot', async () => {
    const expectedId = 0
    const proposalCount = 10
    const name = 'Test ballot'
    const instance = await VotingContract.new()

    await instance.addBallot(name, proposalCount, VOTERS, { from: CREATOR })
    const ballot = await instance.ballots(expectedId)
    const [id, creator, count] = ballot

    assert.equal(id + '', expectedId + '')
    assert.equal(creator, CREATOR)
    assert.equal(count + '', proposalCount + '')
  })

  it('votes', async () => {
    const instance = await VotingContract.new()
    const voter = VOTERS[0]

    await instance.addBallot('Test ballot', 10, VOTERS, { from: voter })
    await instance.begin(0, { from: voter })

    const [, , countBefore] = await instance.ballots(0)
    await instance.vote(0, 0, { from: voter })
    const [, , countAfter] = await instance.ballots(0)

    assert.equal(Number(countBefore), Number(countAfter))
  })

  it('throws when not voter votes', async () => {
    const instance = await VotingContract.new()
    await instance.addBallot('Test ballot', 10, VOTERS)
    await instance.begin(0)

    await assertPromiseRejected(instance.vote(0, 0, { from: NOT_VOTERS[0] }))
  })

  it('emits a BallotAdded event', async () => {
    const expectedId = 0

    const instance = await VotingContract.new()
    const result = await instance.addBallot('Test ballot', 10, VOTERS)
    await instance.begin(0)

    const event = getEventFromLogs(result.logs, 'BallotAdded')
    const { ballotId } = event.args

    assert.equal(ballotId, expectedId)
  })

  it('emits a Voted event', async () => {
    const expectedBallotId = 0
    const expectedProposalNumber = 5
    const expectedVoter = VOTERS[0]

    const instance = await VotingContract.new()
    await instance.addBallot('Test ballot', 10, VOTERS)
    await instance.begin(0)
    const result = await instance.vote(
      expectedBallotId,
      expectedProposalNumber,
      { from: expectedVoter },
    )

    const event = getEventFromLogs(result.logs, 'Voted')
    const { ballotId, proposalNumber, voter } = event.args

    assert.equal(ballotId, expectedBallotId)
    assert.equal(proposalNumber, expectedProposalNumber)
    assert.equal(voter, expectedVoter)
  })

  context('Execution costs', () => {
    accounts.reduce((prevVoters: string[], account, i) => {
      const voters = [...prevVoters, account]

      context(`with ${voters.length} voters`, () => {
        it('adds a ballot', async () => {
          const name = 'Test ballot'
          const instance = await VotingContract.new()
          const gas = await (instance.addBallot as any).estimateGas(
            name,
            10,
            voters,
            { from: VOTERS[0] },
          )
          console.log(`\tGas - addBallot: ${gas}`)
        })

        it('votes', async () => {
          const instance = await VotingContract.new()
          const voter = VOTERS[0]

          await instance.addBallot('Test ballot', 10, VOTERS, { from: voter })
          await instance.begin(0, { from: voter })

          const gas = await (instance as any).vote.estimateGas(0, 0, {
            from: voter,
          })

          console.log(`\tGas - vote: ${gas}`)
        })
      })

      return voters
    }, [])
  })
})
