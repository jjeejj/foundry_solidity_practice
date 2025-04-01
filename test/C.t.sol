// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "src/C.sol";
import {Test, console} from "forge-std/Test.sol";

contract CTest is Test {
    C public c;

    function setUp() public {
        c = new C();
    }

    function test_Foo() public {
        console.log(c.foo());
    }
}
