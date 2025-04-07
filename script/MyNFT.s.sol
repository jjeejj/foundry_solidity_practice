// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/MyNFT.sol";

contract MyNFTScript is Script {
    function setUp() public {}

    function run() public {
        string memory deployerPrivateKeyStr = vm.envString("PT_ACCOUNT_PRIVATE_KEY");
        uint256 deployerPrivateKey = vm.parseUint(deployerPrivateKeyStr);
        vm.startBroadcast(deployerPrivateKey);

        // 部署NFT合约
        MyNFT nft = new MyNFT();
        
        // 铸造一个NFT给部署者
        // address deployer = vm.addr(deployerPrivateKey);
        // nft.mint(deployer, "ipfs://bafkreif2mwhffbn3wu64td7hdwimleve5zy75foeakbbeqgm5m5h24m35q");

        vm.stopBroadcast();

        console.logAddress(address(nft));
    }
}