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

    it('Should set the approval for all tokens', async ()=>{
        await moy.mint(10, {from: accounts[0]})
        try{
            await moy.setApprovalForAll(accounts[0], true,{from: accounts[0]})
        }catch(e){
            assert(e.message.indexOf('revert') >= 0, "operator equals owner")
        }
        const receipt = await moy.setApprovalForAll(accounts[1], true,{from: accounts[0]})
        assert.equal(receipt.logs.length, 1, "trigger event")
        assert.equal(receipt.logs[0].event, "ApprovalForAll", "should trigger approval for all event")
        assert.equal(receipt.logs[0].args.owner, accounts[0], "correct owner")
        assert.equal(receipt.logs[0].args.operator, accounts[1], "correct operator")
        assert.equal(receipt.logs[0].args.approved, true, "is approved")
        assert.equal(await moy.isApprovedForAll(accounts[0],accounts[1]), true, "is approved")
        await moy.setApprovalForAll(accounts[1], false,{from: accounts[0]})
    })
  
    it('Should make a transfer from', async ()=>{
        await moy.mint(10,{from: accounts[0]})
        try{
            await moy.transferFrom(accounts[0],accounts[1], 20, {from: accounts[0]})
        }catch(e){
            assert(e.message.indexOf('revert') >= 0,"token doesn't exist")
        }
        try{
            await moy.transferFrom(accounts[0],accounts[1], 10, {from: accounts[1]})
        }catch(e){
            assert(e.message.indexOf('revert') >= 0,"sender is not approved neither the owner")
        }
        try{
            await moy.transferFrom(accounts[1],accounts[2], 10, {from: accounts[0]})
        }catch(e){
            assert(e.message.indexOf('revert') >= 0,"from is not the owner")
        }

        const receipt = await moy.transferFrom(accounts[0],accounts[1], 10, {from: accounts[0]})
        assert.equal(receipt.logs.length, 1, "trigger event")
        assert.equal(receipt.logs[0].event, "Transfer", "should trigger transfer event")
        assert.equal(receipt.logs[0].args.from, accounts[0], "from")
        assert.equal(receipt.logs[0].args.to, accounts[1], "to")
        assert.equal(receipt.logs[0].args.tokenId.toNumber(), 10, "id")

        const balance1 = await moy.balanceOf(accounts[0])
        const balance2 = await moy.balanceOf(accounts[1])
        const owner = await moy.ownerOf(10)
        assert.equal(balance1.toNumber(),0)
        assert.equal(balance2.toNumber(),1)
        assert.equal(owner,accounts[1]) 
    })

    it('Should make a safe transfer from', async ()=>{
        await moy.mint(20,{from: accounts[0]})
        try{
            await moy.safeTransferFrom(accounts[0],accounts[1], 30, {from: accounts[0]})
        }catch(e){
            assert(e.message.indexOf('revert') >= 0,"token doesn't exist")
        }
        try{
            await moy.safeTransferFrom(accounts[0],accounts[1], 20, {from: accounts[1]})
        }catch(e){
            assert(e.message.indexOf('revert') >= 0,"sender is not approved neither the owner")
        }
        try{
            await moy.safeTransferFrom(accounts[1],accounts[2], 20, {from: accounts[0]})
        }catch(e){
            assert(e.message.indexOf('revert') >= 0,"from is not the owner")
        }

        const receipt = await moy.safeTransferFrom(accounts[0],accounts[1], 20, {from: accounts[0]})
        assert.equal(receipt.logs.length, 1, "trigger event")
        assert.equal(receipt.logs[0].event, "Transfer", "should trigger transfer event")
        assert.equal(receipt.logs[0].args.from, accounts[0], "from")
        assert.equal(receipt.logs[0].args.to, accounts[1], "to")
        assert.equal(receipt.logs[0].args.tokenId.toNumber(), 20, "id")

        const balance1 = await moy.balanceOf(accounts[0])
        const balance2 = await moy.balanceOf(accounts[1])
        const owner = await moy.ownerOf(20)
        assert.equal(balance1.toNumber(),0)
        assert.equal(balance2.toNumber(),2)
        assert.equal(owner,accounts[1]) 
    })

    it('Should set the approval for one token and get the approved address', async ()=>{
        await moy.mint(30, {from: accounts[0]})
        try{
            await moy.approve(accounts[1], 40,{from: accounts[0]})
        }catch(e){
            assert(e.message.indexOf('revert') >= 0, "token doesn't exists")
        }
        try{
            await moy.approve(accounts[1], 30,{from: accounts[1]})
        }catch(e){
            assert(e.message.indexOf('revert') >= 0, "sender is not the owner")
        }
        const receipt = await moy.approve(accounts[1], 30,{from: accounts[0]})
        assert.equal(receipt.logs.length, 1, "trigger event")
        assert.equal(receipt.logs[0].event, "Approval", "should trigger approval event")
        assert.equal(receipt.logs[0].args.owner, accounts[0], "correct owner")
        assert.equal(receipt.logs[0].args.approved, accounts[1], "approved address")
        assert.equal(receipt.logs[0].args.tokenId, 30, "token approved")

        try{
            await moy.getApproved(40)
        }catch(e){
            assert(e.message.indexOf('revert') >= 0, "token doesn't exists")
        }
        assert.equal(await moy.getApproved(30), accounts[1], "is approved")
    })
})