module.exports = function (deployer /*: Truffle.Deployer */) {
  const Migrations = artifacts.require('Migrations')

  deployer.deploy(Migrations)
}
