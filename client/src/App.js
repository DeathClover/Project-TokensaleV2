import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";

import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false , kycAddress: "0x123" , tokenSaleAddress: "" , userToken: 0 , totalSupply: 0};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      //this.networkId = await this.web3.eth.net.getId(); <<-- this does not work with metamask 
      this.networkId = await this.web3.eth.getChainId();

      this.MyToken = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      this.MyTokenSale = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      this.KycContract = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );

      
      

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      this.setState({loaded: true , tokenSaleAddress: this.MyTokenSale._address }, this.updateAll);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // Handlers 

  handleBuyToken = async () => {
    await this.MyTokenSale.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: 1 * 10^18});
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleKycSumbit = async () => {
    const {kycAddress} = this.state;
    await this.KycContract.methods.setKycCompleted(kycAddress).send({from: this.accounts[0]});
    alert("Account "+kycAddress+" is now whitelisted");
  }

  // UpDates for user and total supply 
  
  updateUserToken = async () => {
    let userTokens = await this.MyToken.methods.balanceOf(this.accounts[0]).call();
    this.setState({userToken: userTokens});
  } 

  updateTotalSupply = async () => {
    let _totalSupply = await this.MyToken.methods.totalSupply().call();
    this.setState({totalSupply: _totalSupply});
  }

  updateAll = async () => {
    this.updateTotalSupply();
    this.updateUserToken();

  }

  

  listenToTokenTransfer = async() => {
    this.MyToken.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserToken);
  }

 

 

 
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1> Capuccino Token for StarDucks</h1>
        <h2>Enable your Account</h2>
        Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}/>
        <button type="button" onClick={this.handleKycSumbit}>Add Address to Whitelist</button>
        <h2>Buy Capuccino-Tokens</h2>
        <p>Send Ether to this address: {this.state.tokenSaleAddress}</p>
        <p>Current Total Supply : {this.state.totalSupply}</p>
        <p>You have : {this.state.userToken} Tokens</p>
        <button type="button" onClick={this.handleBuyToken}>Buy more tokens</button>

      </div>
    );
  }
}

export default App;
