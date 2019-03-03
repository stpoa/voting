import React, { useState, useEffect } from 'react'
import VotingContract from './contracts/Voting.json'
import getWeb3 from './utils/getWeb3'
import BallotList from './components/BallotList'
import Ballot from './components/Ballot'
import BallotCreate from './components/BallotCreate'
import { getContractInstance } from './lib/eth.js';

const Dapp = () => {
  const [web3, setWeb3] = useState(null)
  const [accounts, setAccounts] = useState(null)
  const [contract, setContract] = useState(null)
  const [ballot, setBallot] = useState({})
  const [ballotOpen, setBallotOpen] = useState(false)

  const isDappReady = () => !web3 || !contract || !accounts

  const handleBallotClose = () => {
    setBallotOpen(false)
  }

  const handleBallotClick = ballot => _ => {
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

  return isDappReady() ? (
    <div>Loading...</div>
  ) : (
    <>
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
    </>
  )
}

export default Dapp
