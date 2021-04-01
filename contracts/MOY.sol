pragma solidity ^0.5.0;

import "./interfaces/ERC721.sol";
import "./interfaces/ERC721Receiver.sol";
import "./interfaces/extensions/ERC721Metadata.sol";
import "./interfaces/extensions/ERC721Enumerable.sol";

contract MOY is ERC721, ERC721Enumerable{

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    uint256[] private _tokenIndex;
    
    mapping (address => uint256) private _balance;
    mapping (uint256 => address) private _owner;
    mapping (uint256 => address) private _approvedAddress;
    mapping(address => uint256[]) private _ownedTokens;
    mapping (address => mapping(address => bool)) private _authorizedOperator;

    struct Coffee{
        string farmer;
        string toaster;
        string coffeeType;
        string altitude;
        string humidity;
        string originPlace;
        uint seal;
    }
    
    mapping(uint256 => Coffee) private _coffee;

    constructor() public {
    }

    function mint(string memory _name) public {
        uint id = _tokenIndex.length;
        _tokenIndex.push(id);
        _owner[id] = _msgSender();
        _coffee[id].coffeeType = _name;  
    }

    function getCofName(uint256 _id) external view returns(string memory){
        return _coffee[_id].coffeeType;
    }

    function getCoffee(uint256 _tokenId) external view returns (string memory, string memory, string memory, string memory, uint) {
        return (_coffee[_tokenId].coffeeType, _coffee[_tokenId].altitude,
                _coffee[_tokenId].humidity, _coffee[_tokenId].originPlace, _coffee[_tokenId].seal);
    }

    function totalSupply() external view returns (uint256){
        return _tokenIndex.length;
    }

    function tokenByIndex(uint256 _index) external view returns (uint256){
        require(_index < this.totalSupply());
        return _tokenIndex[_index];
    }

    function tokenOfOwnerByIndex(address owner, uint256 _index) external view returns (uint256){
        require(_index < this.balanceOf(owner));
        return _ownedTokens[owner][_index];
    }

    function balanceOf(address owner) external view returns (uint256){
        require(owner != address(0));
        return _balance[owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address){
        address owner = _owner[_tokenId];
        require(owner != address(0));
        return owner;
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata data) external payable {
        _transfer(_from, _to, _tokenId);
    }


    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable {
        this.safeTransferFrom(_from,_to,_tokenId, " ");
    }

    function _msgSender() internal view returns (address payable) {
        return msg.sender;
    }

    function _transfer(address _from, address _to, uint256 _tokenId) internal{
        require(this.ownerOf(_tokenId) == _msgSender() || _authorizedOperator[_from][_msgSender()] == true || this.getApproved(_tokenId) == _msgSender());
        require(this.ownerOf(_tokenId) == _from);
        require(_to != address(0));
        require(this.ownerOf(_tokenId) != address(0));
        this.approve(address(0),_tokenId);
        _balance[_from] -= 1;
        _balance[_to] += 1;
        _owner[_tokenId] = _to;
        emit Transfer(_from,_to,_tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable{
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable{
        require(_approved != address(0));
        require(this.ownerOf(_tokenId) == msg.sender || _authorizedOperator[msg.sender][_approved] == true);
        _approvedAddress[_tokenId] = _approved;
        emit Approval(this.ownerOf(_tokenId), _approved, _tokenId);

    }

    function setApprovalForAll(address _operator, bool _approved) external{
        require(_operator != msg.sender);
        _authorizedOperator[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function getApproved(uint256 _tokenId) external view returns (address){
        require(this.ownerOf(_tokenId) != address(0));
        return _approvedAddress[_tokenId];
    }

    function isApprovedForAll(address owner, address _operator) external view returns (bool){
        return _authorizedOperator[owner][_operator];
    }
}
