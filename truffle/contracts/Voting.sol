pragma solidity ^0.5.0;


contract Voting {

    //--- Structures
    struct Ballot {
        uint256 id;
        address creator;
        uint8 proposalCount;
        mapping (address => bool) canVote;
        mapping (uint8 => uint256) proposalVoteCount;
    }

    //--- Variables
    mapping (uint256 => Ballot) public ballots;
    uint256 public ballotCount;
    uint8 public constant MAX_PROPOSAL_COUNT = 100;

    //--- Events
    event Voted(address voter, uint256 ballotId, uint8 proposalNumber);
    event BallotAdded(uint256 id, string name);

    //--- Getters
    function canVote(
        uint256 ballotId,
        address voter
    )
        public view returns(bool)
    {
        return ballots[ballotId].canVote[voter];
    }

    function proposalVoteCount(
        uint256 ballotId,
        uint8 proposalNumber
    )
        public view returns(uint256)
    {
        return ballots[ballotId].proposalVoteCount[proposalNumber];
    }

    //--- Functions
    function addBallot( string memory name, uint8 proposalCount, address[] memory voters) public {
        require(proposalCount <= MAX_PROPOSAL_COUNT);

        ballots[ballotCount] = Ballot(ballotCount, msg.sender, proposalCount);
        for (uint i = 0; i < voters.length; ++i) {
            ballots[ballotCount].canVote[voters[i]] = true;
        }

        emit BallotAdded(ballotCount, name);
        ballotCount++;
    }

    function vote(uint ballotId, uint8 proposalNumber) public {
        Ballot storage ballot = ballots[ballotId];

        require(ballot.canVote[msg.sender]);

        ballot.canVote[msg.sender] = false;
        ballot.proposalVoteCount[proposalNumber]++;

        emit Voted(msg.sender, ballot.id, proposalNumber);
    }

}