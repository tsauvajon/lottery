pragma solidity ^0.4.21;

import "./Killable.sol";
import "./SafeMath.sol";

contract Lottery is Killable {
    using SafeMath for uint256;

    mapping(address => uint256) usersBet;
    mapping(uint256 => address) users;

    uint256 public nbUsers = 0;
    uint256 public totalBets = 0;

    event Bet(address _player, uint256 _amount);
    event Won(address _winner, uint256 _pot);

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

        totalBets = totalBets.add(msg.value);
        usersBet[msg.sender] = usersBet[msg.sender].add(msg.value);

        emit Bet(msg.sender, msg.value);
    }

    function endLottery() public onlyOwner returns (address) {
        uint256 sum = 0;
        uint256 winningNumber = uint256(blockhash(block.number - 1)) % totalBets;

        for (uint256 i = 0; i < nbUsers; i++) {
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
