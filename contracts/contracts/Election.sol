// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Ballot.sol";
import "./VoterRegistry.sol";

/// @title Election Manager
/// @notice Creates and tracks ballots (one Ballot contract per election).
contract Election is AccessControl {
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;

    struct ElectionInfo {
        uint256 id;
        string name;
        address ballotAddress;
        uint256 startTime;
        uint256 endTime;
        bool exists;
    }

    uint256 public electionCount;
    mapping(uint256 => ElectionInfo) public elections;

    VoterRegistry public registry;

    event ElectionCreated(uint256 indexed electionId, address ballotAddress, string name, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name);
    event ElectionEnded(uint256 indexed electionId);

    constructor(address registryAddress, address admin) {
        require(registryAddress != address(0), "Election: invalid registry");
        registry = VoterRegistry(registryAddress);
        _grantRole(ADMIN_ROLE, admin);
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Election: restricted to admins");
        _;
    }

    /// @notice Create a new election and deploy a Ballot contract for it
    function createElection(string memory name, uint256 startTime, uint256 endTime) external onlyAdmin returns (uint256) {
        require(startTime < endTime, "Election: start < end required");
        electionCount++;
        uint256 id = electionCount;

        // Deploy new Ballot with registry address
        Ballot ballot = new Ballot(address(registry), id, name, startTime, endTime);

        elections[id] = ElectionInfo({
            id: id,
            name: name,
            ballotAddress: address(ballot),
            startTime: startTime,
            endTime: endTime,
            exists: true
        });

        emit ElectionCreated(id, address(ballot), name, startTime, endTime);
        return id;
    }

    /// @notice Add candidate to ballot (admin)
    function addCandidate(uint256 electionId, string memory candidateName) external onlyAdmin {
        ElectionInfo storage info = elections[electionId];
        require(info.exists, "Election: not found");
        Ballot ballot = Ballot(info.ballotAddress);
        ballot.addCandidate(candidateName);

        // We can't read returned candidateId here easily; emit from Ballot
        emit CandidateAdded(electionId, 0, candidateName);
    }

    /// @notice End an election and optionally call endBallot
    function endElection(uint256 electionId) external onlyAdmin {
        ElectionInfo storage info = elections[electionId];
        require(info.exists, "Election: not found");
        Ballot ballot = Ballot(info.ballotAddress);
        ballot.endBallot();
        emit ElectionEnded(electionId);
    }

    /// @notice Get Ballot contract address
    function getBallotAddress(uint256 electionId) external view returns (address) {
        ElectionInfo storage info = elections[electionId];
        require(info.exists, "Election: not found");
        return info.ballotAddress;
    }

    /// @notice Get basic election metadata
    function getElectionInfo(uint256 electionId) external view returns (string memory name, uint256 startTime, uint256 endTime, address ballotAddress) {
        ElectionInfo storage info = elections[electionId];
        require(info.exists, "Election: not found");
        return (info.name, info.startTime, info.endTime, info.ballotAddress);
    }
}