const MOY = artifacts.require("MOY")

var assert = require("assert");

contract('MOY',function(accounts){
    var tokenInstance;

    it('make transfer',async function(){
        tokenInstance = await MOY.deployed()
        fromAccount = accounts[1]
        toAccount = accounts[2]
        spendingAccount = accounts[3]

        
        
        await tokenInstance.mint("black coffe",fromAccount)
        return tokenInstance.safeTransferFrom(fromAccount, toAccount, 0, {from: toAccount}).then(assert.fail).catch(function(error){
            assert(error.message.indexOf("revert") >= 0, "erro caralho")
        })
    })  
})