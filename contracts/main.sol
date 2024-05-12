// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Main {
    address public owner;
    
    event UserCreated(address indexed user, string roles);
    event DataUploaded(address indexed owner, string hash, string policy);
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only admin can perform this action");
        _;
    }

    struct User {
        address user;
        string roles;
    }

    struct Data {
        string hash;
        address owner;
        string policy;
        string url;
    }

    mapping (string => Data) fetchData;
    mapping (address => User) findUser;
    mapping (address => bool) checkUsereExists;

    function createNewUser(address _user, string memory _roles) public onlyOwner {
        require(_user != address(0), "Invalid user address");
        checkUsereExists[_user] = true;
        findUser[_user] = User(_user, _roles);
        emit UserCreated(_user, _roles);
    }

    function getUser(address _user) public view returns (string memory) {
        require(msg.sender == owner || msg.sender == _user, "Only the admin or concerned user may view this data");
        return findUser[_user].roles;
    }

    function uploadData(string memory _hash, string memory _policy, string memory _url) public {
        require(checkUsereExists[msg.sender], "User is not registered");
        fetchData[_hash] = Data(_hash, msg.sender, _policy, _url);
        emit DataUploaded(msg.sender, _hash, _policy);
    }

    function getData(string memory _id) public view returns (Data memory) {
        return fetchData[_id];
    }

    function doesUserExist(address _user) public view returns (bool) {
        return checkUsereExists[_user];
    }

    function modifyPolicy(string memory _newPolicy, string memory _hash, string memory _url) public {
        require(fetchData[_hash].owner == msg.sender, "Only data owner can modify the access policy");
        fetchData[_hash] = Data(_hash, msg.sender, _newPolicy, _url);
    }

    function deleteFile(string memory _hash) public {
        require(fetchData[_hash].owner == msg.sender, "Only owner can delete the data");
        delete fetchData[_hash];
    }
}
