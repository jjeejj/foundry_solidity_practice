// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { Test, console } from  "forge-std/Test.sol";
import "../src/MyNFT.sol";

contract MyNFTTest is Test {
    MyNFT nft;
    address owner = address(1);
    address user = address(2);
    
    function setUp() public {
        vm.prank(owner);
        nft = new MyNFT();
    }
    
    function test_Mint() public {
        console.log(owner);
        string memory tokenURI = "ipfs://bafkreif2mwhffbn3wu64td7hdwimleve5zy75foeakbbeqgm5m5h24m35q";
        
        // 只有所有者可以铸造
        vm.prank(owner);
        uint256 tokenId = nft.mint(user, tokenURI);
        
        // 验证铸造结果
        assertEq(nft.ownerOf(tokenId), user);
        assertEq(nft.tokenURI(tokenId), tokenURI);
    }
    
    function test_FailMintByNonOwner() public {
        // 非所有者不能铸造，验证合约会回滚
        vm.prank(user);
        vm.expectRevert();
        nft.mint(user, "ipfs://bafkreif2mwhffbn3wu64td7hdwimleve5zy75foeakbbeqgm5m5h24m35q");
    }
    
    function test_TokenURI() public {
        string memory tokenURI = "ipfs://bafkreif2mwhffbn3wu64td7hdwimleve5zy75foeakbbeqgm5m5h24m35q";
        
        // 铸造NFT
        vm.prank(owner);
        uint256 tokenId = nft.mint(user, tokenURI);
        
        // 验证tokenURI
        assertEq(nft.tokenURI(tokenId), tokenURI);
    }
}