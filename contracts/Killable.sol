pragma solidity ^0.4.21;

import "./Ownable.sol";

contract Killable is Ownable {
    function kill() public onlyOwner {
        selfdestruct(owner);
    }
}
