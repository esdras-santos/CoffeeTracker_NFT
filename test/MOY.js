const MOY = artifacts.require("MOY")

contract("MOY", (accounts) =>{
    let moy = null
    before(async ()=>{
        moy = await MOY.deployed()
    })

    it('Should show the correct balance and owner', async ()=>{
        await moy.mint(10,{from: accounts[0]})
        const balance = await moy.balanceOf(accounts[0])
        assert(balance.toNumber() === 1)
        const owner = await moy.ownerOf(10)
        try{
            const owner = await moy.ownerOf(20)
            assert.equal(owner, accounts[1])        
        }catch(e){
            assert(e.message.indexOf("revert") >= 0, "wrong owner")
        }
        assert.equal(owner, accounts[0])
    })
})