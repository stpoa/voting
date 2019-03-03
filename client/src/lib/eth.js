export const getContractInstance = async ({ web3, contractDefinition }) => {
  const networkId = await web3.eth.net.getId()
  const deployedNetwork = contractDefinition.networks[networkId]
  return new web3.eth.Contract(
    contractDefinition.abi,
    deployedNetwork && deployedNetwork.address,
  )
}
