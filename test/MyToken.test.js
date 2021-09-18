const Token = artifacts.require("MyToken");

var chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Token Test", function ( accounts)  {
    const [ initialHolder, recipient, anotherAccount ] = accounts;

    beforeEach( async() => {
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    })


    it("All tokens should be in my account", async () => {
    //let instance = await Token.deployed();
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();
    //old style:
    //let balance = await instance.balanceOf.call(initialHolder);
    //assert.equal(balance.valueOf(), 0, "Account 1 has a balance");
    //condensed, easier readable style:
    return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("I can send money from account 1 to account 2", async () => {
        const sendTokens = 1;
      //let instance = await Token.deployed();
      let instance = this.myToken;
      let totalSupply = await instance.totalSupply();
      await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
      await expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;      
      await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
      return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    })

    it("is not possible to send more tokens than what account 1 has.", async () => {
        //let instance = await Token.deployed();
        let instance = this.myToken;
        let balanceofAccount = await instance.balanceOf(initialHolder);
        await expect(instance.transfer(recipient, new BN(balanceofAccount + 1))).to.eventually.be.rejected;
        //check if the balancee is still the same 
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceofAccount);

    })
});