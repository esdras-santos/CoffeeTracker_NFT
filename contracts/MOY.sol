pragma solidity ^0.8.0;


import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

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

    constructor() public{}

   
}

