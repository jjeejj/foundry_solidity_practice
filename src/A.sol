// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {console} from "forge-std/Test.sol";

contract A {
    function foo() public pure virtual returns (uint256) {
        console.log("A");
        return 1;
    }
}
