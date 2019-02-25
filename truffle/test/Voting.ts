import { assert } from 'chai';

const VotingContract = artifacts.require('Voting.sol');


contract('Voting', (accounts) => {

  // Accounts
  const CREATOR = accounts[0];
  const VOTERS = [1, 2, 3, 4, 5].map(v => accounts[v]);
  const NOT_VOTERS = [6, 7, 8, 9].map(v => accounts[v]);
  // Proposals
  const MAX_PROPOSALS_COUNT = 100;

  it('initiates voting contract', async () => {
    const instance = await VotingContract.new();
    assert.ok(instance);
  });

  it('gets not existing ballot', async () => {
    const instance = await VotingContract.new();
    const ballot = await instance.ballots(0);

    const [ id, creator, count ] = ballot;

    assert.equal(id, 0);
    assert.equal(creator, '0x0000000000000000000000000000000000000000');
    assert.equal(count, 0);
  });

  // it(`throws when number of proposals larger than ${MAX_PROPOSALS_COUNT}`, async () => {
  //   const toManyProposals = MAX_PROPOSALS_COUNT + 1;
  //   const instance = await VotingContract.new();

  //   await assertThrowsVmException(async () => {
  //     await instance.addBallot('Test ballot', toManyProposals, VOTERS);
  //     console.log(await instance.ballots(0));
  //   });
  // });

  // it('adds a ballot', async () => {
  //   const expectedId = 0;
  //   const proposalCount = 10;
  //   const name = 'Test ballot';
  //   const instance = await VotingContract.new();

  //   await instance.addBallot(name, proposalCount, VOTERS, { from: CREATOR });
  //   const ballot = await instance.ballots(expectedId);
  //   const [ id, creator, count ] = ballot;

  //   assertNumberEqual(id, expectedId, 0);
  //   assert.equal(creator, CREATOR);
  //   assertNumberEqual(count, proposalCount, 0);
  // });

  // it('votes', async () => {
  //   const instance = await VotingContract.new();
  //   const voter = VOTERS[0];

  //   await instance.addBallot('Test ballot', 10, VOTERS, { from: voter });

  //   const [, , countBefore] = (await instance.ballots(0));
  //   await instance.vote(0, 0, { from: voter });
  //   const [, , countAfter] = (await instance.ballots(0));

  //   assert.equal(Number(countBefore), Number(countAfter));
  // });

  // it('throws when not voter votes', async () => {
  //   const instance = await VotingContract.new();
  //   await instance.addBallot('Test ballot', 10, VOTERS);

  //   await assertThrowsVmException(async () => {
  //     await instance.vote(0, 0, { from: NOT_VOTERS[0] });
  //   });
  // });


  // it('emits a BallotAdded event', async () => {
  //   const expectedId = 0;

  //   const instance = await VotingContract.new();
  //   const result = await instance.addBallot('Test ballot', 10, VOTERS);

  //   const event = getEventFromLogs(result.logs, 'BallotAdded');
  //   const { id } = event.args;

  //   assertNumberEqual(id, expectedId, 0);
  // });

  // it('emits a Voted event', async () => {
  //   const expectedBallotId = 0;
  //   const expectedProposalNumber = 5;
  //   const expectedVoter = VOTERS[0];

  //   const instance = await VotingContract.new();
  //   await instance.addBallot('Test ballot', 10, VOTERS);
  //   const result = await instance.vote(expectedBallotId, expectedProposalNumber, { from: expectedVoter });

  //   const event = getEventFromLogs(result.logs, 'Voted');
  //   const { ballotId, proposalNumber, voter } = event.args;

  //   assertNumberEqual(ballotId, expectedBallotId, 0);
  //   assertNumberEqual(proposalNumber, expectedProposalNumber, 0);
  //   assert.equal(voter, expectedVoter);
  // });

  // context('Execution costs', () => {

  //   accounts.reduce((prevVoters: string[], account, i) => {
  //     const voters = [...prevVoters, account];

  //     let instance: Voting;
  //     let expectedId: number;
  //     let name: string;
  //     before(async () => {
  //         instance = await VotingContract.new();
  //         expectedId = 0;
  //         name = 'Test ballot';
  //     });

  //     context(`with ${voters.length} voters`, () => {
  //       it('adds a ballot', async () => {
  //         const gas = await (instance as any).addBallot.estimateGas(name, 10, voters, {from: CREATOR});
  //         const ballot = await instance.ballots(expectedId);
  //         const [id, creator, count] = ballot;

  //         console.log(`\tGas - addBallot: ${gas}`);
  //       });

  //       it('votes', async () => {
  //         const voter = VOTERS[0];

  //         await instance.addBallot('Test ballot', 10, VOTERS, { from: voter });

  //         const gas = await (instance as any).vote.estimateGas(0, 0, { from: voter });

  //         console.log(`\tGas - vote: ${gas}`);
  //       });
  //     });

  //     return voters;
  //   }, []);
  // });
});
