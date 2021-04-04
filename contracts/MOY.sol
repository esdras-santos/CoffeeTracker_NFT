pragma solidity ^0.5.0;

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
    function mint(
        address to,
        string memory seal, 
        string memory altitude,
        string memory humidity, 
        string memory originPlace, 
        string memory farmer
        ) public {
        _coffeeAttributes["seal"][]
        _safeMint(to, tokenId);
    }


}