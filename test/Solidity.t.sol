// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";

contract SolidityTest is Test {
    function test_ContractInherit() public pure {
        console.log(unicode"这是一条普通日志");
        assertEq(true, true);
    }

    function test_BlockPrevrandao() public view {
        console.log(block.prevrandao);
    }
}
