// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IVoterRegistry {
    function isRegistered(address voter) external view returns (bool);
}

/// @title Ballot
/// @notice Represents a single election's ballot: candidates, votes and tallying.
///         It checks an external VoterRegistry to validate voters.
contract Ballot is ReentrancyGuard {
    struct Candidate {
        uint256 id;
        string name;
        uint256 votes;
    }

    // External registry contract (not owner-controlled here)
    IVoterRegistry public registry;

    uint256 public electionId;
    string public electionName;
    uint256 public startTime;
    uint256 public endTime;
    bool public ended;

    uint256 public candidateCount;
    uint256 public totalVotes;

    // candidateId (1-based) => Candidate
    mapping(uint256 => Candidate) private candidates;

    // voter address => voted?
    mapping(address => bool) private hasVoted;

    // Events
    event CandidateAdded(uint256 indexed id, string name);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event BallotEnded();

    /// @param _registry address of deployed VoterRegistry
    constructor(
        address _registry,
        uint256 _electionId,
        string memory _electionName,
        uint256 _startTime,
        uint256 _endTime
    ) {
        require(_registry != address(0), "Ballot: invalid registry");
        require(_startTime < _endTime, "Ballot: invalid times");
        registry = IVoterRegistry(_registry);
        electionId = _electionId;
        electionName = _electionName;
        startTime = _startTime;
        endTime = _endTime;
        ended = false;
    }

    modifier onlyDuringVoting() {
        require(!ended, "Ballot: ended");
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Ballot: not active");
        _;
    }

    /// @notice Add candidate (callable by factory/manager external to ballot)
    function addCandidate(string memory name) external {
        // Manager (Election.sol) will call this after creating contract.
        candidateCount++;
        candidates[candidateCount] = Candidate({id: candidateCount, name: name, votes: 0});
        emit CandidateAdded(candidateCount, name);
    }

    /// @notice Cast a vote for a candidate (only registered voters)
    function vote(uint256 candidateId) external nonReentrant onlyDuringVoting {
        require(candidateId > 0 && candidateId <= candidateCount, "Ballot: invalid candidate");
        require(!hasVoted[msg.sender], "Ballot: already voted");
        // Check registry
        require(registry.isRegistered(msg.sender), "Ballot: not registered voter");

        hasVoted[msg.sender] = true;
        candidates[candidateId].votes += 1;
        totalVotes += 1;

        emit VoteCast(msg.sender, candidateId);
    }

    /// @notice End the ballot manually
    function endBallot() external {
        // Could be restricted by manager by using delegatecall pattern.
        ended = true;
        emit BallotEnded();
    }

    /// @notice Returns candidate info arrays
    function getCandidates() external view returns (uint256[] memory ids, string[] memory names, uint256[] memory votes) {
        uint256 n = candidateCount;
        ids = new uint256[](n);
        names = new string[](n);
        votes = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            uint256 idx = i + 1;
            Candidate storage c = candidates[idx];
            ids[i] = c.id;
            names[i] = c.name;
            votes[i] = c.votes;
        }
    }

    /// @notice Has a given address voted?
    function hasAddressVoted(address voter) external view returns (bool) {
        return hasVoted[voter];
    }

    /// @notice Get winner ids and winning vote count (handles ties)
    function getWinners() external view returns (uint256[] memory winnerIds, uint256 winningVoteCount) {
        require(candidateCount > 0, "Ballot: no candidates");
        uint256 maxVotes = 0;
        for (uint256 i = 1; i <= candidateCount; i++) {
            uint256 v = candidates[i].votes;
            if (v > maxVotes) maxVotes = v;
        }
        uint256 winners = 0;
        for (uint256 i = 1; i <= candidateCount; i++) {
            if (candidates[i].votes == maxVotes) winners++;
        }
        winnerIds = new uint256[](winners);
        uint256 ptr = 0;
        for (uint256 i = 1; i <= candidateCount; i++) {
            if (candidates[i].votes == maxVotes) {
                winnerIds[ptr++] = candidates[i].id;
            }
        }
        return (winnerIds, maxVotes);
    }
}