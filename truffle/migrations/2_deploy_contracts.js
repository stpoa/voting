module.exports = function (deployer /*: Truffle.Deployer*/) {
  const Voting = artifacts.require('Voting')

  deployer.deploy(Voting)
}
