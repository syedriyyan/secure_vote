// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title VoterRegistry
/// @notice Manage voter registrations and roles for SecureVote.
contract VoterRegistry is AccessControl {
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;

    mapping(address => bool) private _registered;

    event VoterRegistered(address indexed voter);
    event VoterDeregistered(address indexed voter);

    constructor(address admin) {
        _grantRole(ADMIN_ROLE, admin);
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "VoterRegistry: Restricted to admins");
        _;
    }

    /// @notice Register a voter (admin only)
    function registerVoter(address voter) external onlyAdmin {
        require(voter != address(0), "VoterRegistry: zero address");
        require(!_registered[voter], "VoterRegistry: already registered");
        _registered[voter] = true;
        emit VoterRegistered(voter);
    }

    /// @notice Deregister a voter (admin only)
    function deregisterVoter(address voter) external onlyAdmin {
        require(_registered[voter], "VoterRegistry: not registered");
        _registered[voter] = false;
        emit VoterDeregistered(voter);
    }

    /// @notice Check if an address is registered as voter
    function isRegistered(address voter) external view returns (bool) {
        return _registered[voter];
    }
}