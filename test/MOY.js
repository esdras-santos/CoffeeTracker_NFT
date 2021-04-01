const MOY = artifacts.require("MOY")

contract('MOY',function(accounts){
    var tokenInstance;

    it('make transfer',async function(){
        tokenInstance = await MOY.deployed()
        
    })
})