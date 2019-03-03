import React, { useState, useEffect } from 'react'
import VotingContract from './contracts/Voting.json'
import getWeb3 from './utils/getWeb3'
import Ballot from './components/Ballot'
import BallotList from './components/BallotList'
import { Typography, Divider, withStyles } from '@material-ui/core'
import BallotCreate from './components/BallotCreate.jsx'
import './App.css'

const App = ({ classes }) => {
  const [web3, setWeb3] = useState(null)
  const [accounts, setAccounts] = useState(null)
  const [contract, setContract] = useState(null)
  const [ballot, setBallot] = useState({})
  const [ballotOpen, setBallotOpen] = useState(false)

  const getContractInstance = async ({ web3, contractDefinition }) => {
    const networkId = await web3.eth.net.getId()
    const deployedNetwork = contractDefinition.networks[networkId]
    return new web3.eth.Contract(
      contractDefinition.abi,
      deployedNetwork && deployedNetwork.address,
    )
  }

  const handleBallotClose = () => {
    setBallotOpen(false)
  }

  const handleBallotClick = (ballot) => _ => {
    setBallotOpen(true)
    setBallot(ballot)
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
      <header className={classes.header}>
        <Typography variant="h2" color="textSecondary">
          Voting
        </Typography>
      </header>
      <Divider />
      <BallotList {...{ contract, web3, accounts, handleBallotClick }} />

      <Ballot
        {...{
          contract,
          web3,
          accounts,
          ballot,
          ballotOpen,
          handleBallotClose,
        }}
      />

      <BallotCreate {...{ contract, web3, accounts }} />
    </div>
  )
}

const styles = {
  header: {
    margin: '0.5rem',
  },
}

export default withStyles(styles)(App)
