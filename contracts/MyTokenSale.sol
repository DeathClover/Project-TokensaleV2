//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//import "./CrowdSale.sol";
import "./KycContract.sol";
import "./MintedCrowdsale.sol";

contract MyTokenSale is MintedCrowdsale {

    KycContract kyc;
    constructor( uint256 rate /* rate in TKNbits */ ,address payable wallet, IERC20 _token, KycContract _kyc) MintedCrowdsale() Crowdsale(rate, wallet, _token) {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary,weiAmount);
        require(kyc.KycCompleted(beneficiary), "not copleted yet");
    }
}