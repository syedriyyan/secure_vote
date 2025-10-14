// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Election {
        uint id;
        string title;
        string description;
        uint startTime;
        uint endTime;
        bool active;
        address admin;
        mapping(uint => Candidate) candidates;
        uint candidateCount;
        mapping(address => bool) hasVoted;
    }

    mapping(uint => Election) public elections;
    uint public electionCount;

    event ElectionCreated(uint indexed electionId, string title);
    event VoteCasted(uint indexed electionId, uint candidateId, address voter);

    modifier onlyAdmin(uint _electionId) {
        require(msg.sender == elections[_electionId].admin, "Not admin");
        _;
    }

    modifier validElection(uint _electionId) {
        require(_electionId > 0 && _electionId <= electionCount, "Invalid election");
        _;
    }

    // ✅ Create a new election
    function createElection(
        string memory _title,
        string memory _description,
        uint _startTime,
        uint _endTime
    ) public {
        require(_startTime < _endTime, "Invalid time range");
        electionCount++;
        Election storage e = elections[electionCount];
        e.id = electionCount;
        e.title = _title;
        e.description = _description;
        e.startTime = _startTime;
        e.endTime = _endTime;
        e.active = true;
        e.admin = msg.sender;

        emit ElectionCreated(electionCount, _title);
    }

    // ✅ Add a candidate (only admin)
    function addCandidate(uint _electionId, string memory _name)
        public
        onlyAdmin(_electionId)
        validElection(_electionId)
    {
        Election storage e = elections[_electionId];
        e.candidateCount++;
        e.candidates[e.candidateCount] = Candidate(e.candidateCount, _name, 0);
    }

    // ✅ Vote (only once per address)
    function vote(uint _electionId, uint _candidateId)
        public
        validElection(_electionId)
    {
        Election storage e = elections[_electionId];
        require(block.timestamp >= e.startTime && block.timestamp <= e.endTime, "Voting not active");
        require(!e.hasVoted[msg.sender], "Already voted");
        require(_candidateId > 0 && _candidateId <= e.candidateCount, "Invalid candidate");

        e.hasVoted[msg.sender] = true;
        e.candidates[_candidateId].voteCount++;

        emit VoteCasted(_electionId, _candidateId, msg.sender);
    }

    // ✅ Get candidate info
    function getCandidate(uint _electionId, uint _candidateId)
        public
        view
        returns (string memory name, uint voteCount)
    {
        Election storage e = elections[_electionId];
        Candidate storage c = e.candidates[_candidateId];
        return (c.name, c.voteCount);
    }

    // ✅ End election
    function endElection(uint _electionId) public onlyAdmin(_electionId) {
        elections[_electionId].active = false;
    }
}
