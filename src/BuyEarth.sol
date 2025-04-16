// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract BuyEarth {
    uint256 private constant EARTH_PRICE = 0.001 ether;
    address private owner;

    struct Earth {
        uint color;
        uint price;
        string image_url;
    }
    Earth[100] private earths;
    constructor() {
        owner = msg.sender;
    }

    function buyEarth(uint256 _idx, uint color, string memory imageUrl) public payable {
        require(msg.value == EARTH_PRICE , "Invalid payment");
        require(_idx < 100 && _idx >= 0, "Invalid index");

        (bool send,) = owner.call{value: msg.value}("");
        require(send, "Failed to send Ether");

        earths[_idx] = Earth (color, msg.value, imageUrl);
    }

    function getEarths() public view returns (Earth[100] memory) {
        Earth[100] memory _earths;
        for (uint256 i = 0; i < earths.length; i++) {
            _earths[i] = earths[i];
        }
        return _earths;
    }
}