// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IERC165.sol";

interface IERC721 is IERC165 {
    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function safeTransferForm(address from, address to, uint256 tokenId, bytes calldata data) external;
}