import React, { Component, useState, useEffect } from 'react'
import VotingContract from './contracts/Voting.json'
import getWeb3 from './utils/getWeb3'
import Ballot from './components/Ballot'
import BallotList from './components/BallotList'
import { Typography } from '@material-ui/core'

import './App.css'

const App = () => {
  const [web3, setWeb3] = useState(null)
  const [accounts, setAccounts] = useState(null)
  const [contract, setContract] = useState(null)

  const getContractInstance = async ({ web3, contractDefinition }) => {
    const networkId = await web3.eth.net.getId()
    const deployedNetwork = contractDefinition.networks[networkId]
    return new web3.eth.Contract(
      contractDefinition.abi,
      deployedNetwork && deployedNetwork.address,
    )
  }

  useEffect(() => {
    getWeb3().then(web3 => {
      setWeb3(web3)
      web3.eth.getAccounts().then(setAccounts)
      const contractDefinition = VotingContract
      getContractInstance({ web3, contractDefinition }).then(setContract)
    })
  }, [])

  return !web3 || !contract || !accounts ? (
    <div>Loading...</div>
  ) : (
    <div className="App">
      <Typography variant="h2">Ballot List</Typography>
      <BallotList {...{ contract, web3, accounts }} />

      <Typography variant="h2">Ballot</Typography>
      <Ballot {...{ contract, web3, accounts }} id="8" />

      <Typography variant="h2">Ballot Create</Typography>
    </div>
  )
}

export default App
