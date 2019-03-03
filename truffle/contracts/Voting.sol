pragma solidity ^0.5.0;


contract Voting {

    //--- Structures
    struct Ballot {
        uint256 id;
        address creator;
        uint8 proposalCount;
        mapping (uint8 => bool) proposalDefined;
        mapping (address => bool) canVote;
        mapping (uint8 => uint256) proposalVoteCount;
        bool begun;
    }

    //--- Variables
    mapping (uint256 => Ballot) public ballots;
    uint256 public ballotCount;
    uint8 public constant MAX_PROPOSAL_COUNT = 100;

    //--- Events
    event BallotAdded(
        uint256 indexed id,
        address creator,
        uint8 proposalCount,
        string name
    );

    event BallotProposalDefined(
        uint256 indexed ballotId,
        uint8 indexed proposalId,
        string proposalName
    );

    event Begun(uint256 indexed ballotId);

    event Voted(address indexed voter, uint256 indexed ballotId, uint8 proposalNumber);

    // Modifiers
    modifier onlyBegun(uint256 ballotId) {
        require(ballots[ballotId].begun, "NOT_BEGUN");
        _;
    }

    modifier onlyUnbegun(uint256 ballotId) {
        require(!ballots[ballotId].begun, "BEGUN");
        _;
    }

    modifier onlyCanVote(uint256 ballotId) {
        require(ballots[ballotId].canVote[msg.sender], "CANNOT_VOTE");
        _;
    }

    modifier onlyCreator(uint256 ballotId) {
        require(msg.sender == ballots[ballotId].creator, "NOT_CREATOR");
        _;
    }

    modifier onlyUndefinedProposal(uint256 ballotId, uint8 proposalId) {
        require(
            !ballots[ballotId].proposalDefined[proposalId],
            "PROPOSAL_ALREADY_DEFINED"
        );
        _;
    }

    modifier onlyWithinProposalCount(uint256 ballotId, uint8 proposalId) {
        require(
            proposalId < ballots[ballotId].proposalCount,
            "ID_TO_LARGE"
        );
        _;
    }

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
    function addBallot(
        string memory name,
        uint8 proposalCount,
        address[] memory voters
    ) public {
        require(proposalCount <= MAX_PROPOSAL_COUNT);

        ballots[ballotCount] = Ballot(
            ballotCount,
            msg.sender,
            proposalCount,
            false
        );

        for (uint i = 0; i < voters.length; ++i) {
            ballots[ballotCount].canVote[voters[i]] = true;
        }

        emit BallotAdded(ballotCount, msg.sender, proposalCount, name);
        ballotCount++;
    }

    function defineBallotProposal(
        uint256 ballotId,
        uint8 proposalId,
        string memory proposalName
    ) public
        onlyUnbegun(ballotId)
        onlyUndefinedProposal(ballotId, proposalId)
        onlyWithinProposalCount(ballotId, proposalId)
    {
        emit BallotProposalDefined(ballotId, proposalId, proposalName);
        ballots[ballotId].proposalDefined[proposalId] = true;
    }

    function begin(uint256 ballotId) public onlyCreator(ballotId) {
        ballots[ballotId].begun = true;
        emit Begun(ballotId);
    }

    function vote(
        uint ballotId,
        uint8 proposalNumber
    ) public onlyBegun(ballotId) onlyCanVote(ballotId) {
        Ballot storage ballot = ballots[ballotId];

        ballot.canVote[msg.sender] = false;
        ballot.proposalVoteCount[proposalNumber]++;

        emit Voted(msg.sender, ballot.id, proposalNumber);
    }

}