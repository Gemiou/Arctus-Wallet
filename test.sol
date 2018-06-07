pragma solidity ^0.4.23;

contract Check {
    function transfer(uint256 amount) public;
    function exploit() public {
        Check(0x0).transfer(1 ether);
    }
}
