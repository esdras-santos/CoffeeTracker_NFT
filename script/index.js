const Web3 = require('web3')

const MOY = require('../build/contracts/MOY.json')

const init = async () => {
    const web3 = new Web3('http://127.0.0.1:9545/')

    const id = await web3.eth.net.getId()
    const deployedNetwork = MOY.networks[id]
    const contract =  new web3.eth.Contract(MOY.abi,deployedNetwork.address)

    const address = await web3.eth.getAccounts()

    await contract.methods.mint("black coffee").send({from: address[1], gas: 700000})
    const result = await contract.methods.getCofName(0).call()
    const owner = await contract.methods.ownerOf(0).call()
    console.log(result)
    console.log("owner:",owner)

    await contract.methods.safeTransferFrom(address[1],address[0],0).send({from: address[1], gas: 700000})

    const results = await contract.getPastEvents(
        'Transfer',
        {}
    )

    console.log(results)
}

init()