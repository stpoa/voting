import React, { Component } from 'react'
import VotingContract from './contracts/Voting.json'
import getWeb3 from './utils/getWeb3'
import Ballot from './components/Ballot'

import './App.css'

const addBallot = ({ contract, gas, from }) => async ({
  name,
  proposalCount,
  voters,
}) => {
  return contract.methods
    .addBallot(name, proposalCount + '', voters)
    .send({ from, gas })
}

const getContractInstance = async ({ web3, contractDefinition }) => {
  const networkId = await web3.eth.net.getId()
  const deployedNetwork = contractDefinition.networks[networkId]
  return new web3.eth.Contract(
    contractDefinition.abi,
    deployedNetwork && deployedNetwork.address,
  )
}

const toAddress = num =>
  '0x' +
  Array(40 - (num + '').length)
    .fill(0)
    .join('') +
  num

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null }
  emiters = { ballotAdded: null }

  onBallotAdded = (ballotAddedEvent) => {
    console.log({ ballotAddedEvent })
    this.setState({})
  }

  componentDidMount = async () => {
    const web3 = await getWeb3()
    const accounts = await web3.eth.getAccounts()
    const contract = await getContractInstance({
      web3,
      contractDefinition: VotingContract,
    })

    this.emiters.ballotAdded = contract.events.BallotAdded()
    this.emiters.ballotAdded.on('data', this.onBallotAdded)

    this.setState({ web3, accounts, contract })
  }

  componentWillUnmount = async () => {
    this.emiters.ballotAdded.unsubscribe()
  }

  addBallot = async () => {
    const { accounts, contract } = this.state

    const voter = accounts[0]
    const gas = 500000
    const addBallotResult = await addBallot({ contract, gas, from: voter })({
      name: 'Name',
      proposalCount: 2,
      voters: [voter, toAddress(1)],
    })
    console.log({ addBallotResult })


  }

  vote = async () => {
    const { accounts, contract } = this.state
    const voter = accounts[0]
    const gas = 500000

    const canVote = await contract.methods.canVote('0', voter).call()
    if (canVote) {
      const ballot = await contract.methods.ballots('0').call()
      const proposalVoteCount = await contract.methods
        .proposalVoteCount('0', '0')
        .call()
      await contract.methods.vote(0, 0).send({ from: voter, gas })
      const ballotAfter = await contract.methods.ballots('0').call()
      const proposalVoteCountAfter = await contract.methods
        .proposalVoteCount('0', '0')
        .call()
      console.log({
        ballot,
        ballotAfter,
        proposalVoteCount,
        proposalVoteCountAfter,
      })
    } else {
      console.log('Cannot vote')
    }

    this.setState({ storageValue: 1 })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <div className="App">
        <Ballot />
        <button onClick={this.addBallot}>Add ballot</button>
        <button onClick={this.vote}>Vote</button>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    )
  }
}

export default App
