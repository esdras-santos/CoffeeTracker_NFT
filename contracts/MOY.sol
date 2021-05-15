pragma solidity ^0.6.0;

import './ERC721.sol';

contract MOY is ERC721{
    struct Coffee{
        string farmer;
        string toaster;
        string coffeeType;
        string altitude;
        string humidity;
        string originPlace;
        uint seal;
    }

    mapping(uint256 => Coffee) private _coffeeAttributes;
    
    constructor() public {}
    function mint() public {}


}