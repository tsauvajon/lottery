pragma solidity ^0.4.21;

import "./Killable.sol";

contract Lottery is Killable {
    mapping(address => uint) usersBet;
    mapping(uint => address) users;

    uint public nbUsers = 0;
    uint public totalBets = 0;

    event Bet(address _player, uint _amount);
    event Won(address _winner, uint _pot);

    modifier hasValue() {
        require(msg.value > 0);
        _;
    }

    modifier onlyIf(bool _condition) {
        require(_condition);
        _;
    }

    function bet() public payable hasValue {    
        if (usersBet[msg.sender] == 0) { // new player
            users[nbUsers] = msg.sender;
            nbUsers++;
        }

        usersBet[msg.sender] += msg.value;
        totalBets += msg.value;

        emit Bet(msg.sender, msg.value);
    }

    function endLottery() public onlyOwner returns (address) {
        uint sum = 0;
        uint winningNumber = uint(blockhash(block.number - 1)) % totalBets;

        for (uint i = 0; i < nbUsers; i++) {
            sum += usersBet[users[i]];

            if (sum >= winningNumber) {
                emit Won(users[i], address(this).balance);
                // destroy this contract and send the balance to users[i]
                selfdestruct(users[i]);
                return users[i];
            }
        }
    }

    function () public {
        revert();
    }
}
