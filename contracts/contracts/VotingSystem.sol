// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VotingSystem {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Election {
        uint id;
        string name;
        bool isActive;
        uint startTime;
        uint endTime;
        mapping(uint => Candidate) candidates;
        uint candidatesCount;
        mapping(address => bool) hasVoted;
    }

    address public admin;
    uint public electionsCount;
    mapping(uint => Election) public elections;

    event ElectionCreated(uint electionId, string name);
    event CandidateAdded(uint electionId, string candidateName);
    event VoteCasted(uint electionId, uint candidateId);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function createElection(string memory _name, uint _startTime, uint _endTime) public onlyAdmin {
        require(_endTime > _startTime, "Invalid time period");

        electionsCount++;
        Election storage newElection = elections[electionsCount];
        newElection.id = electionsCount;
        newElection.name = _name;
        newElection.isActive = false;
        newElection.startTime = _startTime;
        newElection.endTime = _endTime;

        emit ElectionCreated(electionsCount, _name);
    }

    function addCandidate(uint _electionId, string memory _name) public onlyAdmin {
        Election storage election = elections[_electionId];
        election.candidatesCount++;
        election.candidates[election.candidatesCount] = Candidate(election.candidatesCount, _name, 0);

        emit CandidateAdded(_electionId, _name);
    }
}