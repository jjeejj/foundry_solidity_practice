// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "./A.sol";
import "./B.sol";

contract C is B, A {
    function foo() public pure override(A, B) returns (uint256) {
        super.foo();
        A.foo();
        B.foo();
        return 3;
    }
}
