// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
        bool exists; // New flag to mark candidate existence
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    address public admin;
    uint public candidatesCount;

    event CandidateRemoved(uint candidateId);
    event VotedEvent(uint indexed candidateId);

    constructor() {
        admin = msg.sender;
    }

    function addCandidate(string memory _name) public {
        require(msg.sender == admin, "Only admin can add candidates");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0, true); // Mark as existing
    }

    function removeCandidate(uint _candidateId) public {
        require(msg.sender == admin, "Only admin can remove candidates");
        require(candidates[_candidateId].exists, "Candidate does not exist");

        delete candidates[_candidateId]; // Remove candidate
        emit CandidateRemoved(_candidateId);
    }

    function vote(uint _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(candidates[_candidateId].exists, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit VotedEvent(_candidateId);
    }

    function getCandidate(uint _id) public view returns (uint, string memory, uint, bool) {
        Candidate memory candidate = candidates[_id];
        return (candidate.id, candidate.name, candidate.voteCount, candidate.exists);
    }

    function getTotalCandidates() public view returns (uint) {
        return candidatesCount;
    }
}
