// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "fhevm/lib/TFHE.sol";

contract SkillMarket {
    using TFHE for euint32;
    using TFHE for euint8;
    using TFHE for ebool;

    struct Developer {
        address wallet;
        euint32 skillScore;
        euint32 expectedSalary;
        bool isActive;
        uint256 timestamp;
    }

    struct Job {
        address employer;
        euint32 requiredScore;
        euint32 offeredSalary;
        string description;
        bool isOpen;
        uint256 timestamp;
    }

    struct Match {
        uint256 developerId;
        uint256 jobId;
        bool isConfirmed;
        bool isCompleted;
    }

    mapping(address => uint256) public developerIds;
    mapping(address => uint256) public employerJobs;
    
    Developer[] public developers;
    Job[] public jobs;
    Match[] public matches;

    uint256 public developerCount;
    uint256 public jobCount;
    uint256 public matchCount;

    event DeveloperRegistered(address indexed developer, uint256 developerId);
    event JobPosted(address indexed employer, uint256 jobId);
    event MatchFound(uint256 developerId, uint256 jobId, uint256 matchId);
    event MatchConfirmed(uint256 matchId);

    modifier onlyActiveDeveloper() {
        require(developerIds[msg.sender] > 0, "Not a registered developer");
        require(developers[developerIds[msg.sender] - 1].isActive, "Developer not active");
        _;
    }

    function registerDeveloper(
        bytes calldata encryptedScore,
        bytes calldata encryptedSalary
    ) external {
        require(developerIds[msg.sender] == 0, "Already registered");

        euint32 skillScore = TFHE.asEuint32(encryptedScore);
        euint32 expectedSalary = TFHE.asEuint32(encryptedSalary);

        TFHE.allow(skillScore, address(this));
        TFHE.allow(expectedSalary, address(this));

        developers.push(Developer({
            wallet: msg.sender,
            skillScore: skillScore,
            expectedSalary: expectedSalary,
            isActive: true,
            timestamp: block.timestamp
        }));

        developerCount++;
        developerIds[msg.sender] = developerCount;

        emit DeveloperRegistered(msg.sender, developerCount);
    }

    function postJob(
        bytes calldata encryptedRequiredScore,
        bytes calldata encryptedOfferedSalary,
        string memory description
    ) external {
        euint32 requiredScore = TFHE.asEuint32(encryptedRequiredScore);
        euint32 offeredSalary = TFHE.asEuint32(encryptedOfferedSalary);

        TFHE.allow(requiredScore, address(this));
        TFHE.allow(offeredSalary, address(this));

        jobs.push(Job({
            employer: msg.sender,
            requiredScore: requiredScore,
            offeredSalary: offeredSalary,
            description: description,
            isOpen: true,
            timestamp: block.timestamp
        }));

        jobCount++;
        employerJobs[msg.sender] = jobCount;

        emit JobPosted(msg.sender, jobCount);
    }

    function findMatches() external view returns (uint256[] memory) {
        uint256[] memory potentialMatches = new uint256[](jobCount);
        uint256 matchCounter = 0;

        uint256 developerIndex = developerIds[msg.sender];
        require(developerIndex > 0, "Not a registered developer");
        
        Developer storage dev = developers[developerIndex - 1];

        for (uint256 i = 0; i < jobCount; i++) {
            if (jobs[i].isOpen) {
                ebool scoreMatch = TFHE.gte(dev.skillScore, jobs[i].requiredScore);
                ebool salaryMatch = TFHE.lte(dev.expectedSalary, jobs[i].offeredSalary);
                
                if (TFHE.decrypt(TFHE.and(scoreMatch, salaryMatch))) {
                    potentialMatches[matchCounter] = i + 1;
                    matchCounter++;
                }
            }
        }

        uint256[] memory result = new uint256[](matchCounter);
        for (uint256 i = 0; i < matchCounter; i++) {
            result[i] = potentialMatches[i];
        }

        return result;
    }

    function applyForJob(uint256 jobId) external onlyActiveDeveloper {
        require(jobId > 0 && jobId <= jobCount, "Invalid job ID");
        require(jobs[jobId - 1].isOpen, "Job not open");

        uint256 developerIndex = developerIds[msg.sender] - 1;
        Developer storage dev = developers[developerIndex];

        ebool scoreMatch = TFHE.gte(dev.skillScore, jobs[jobId - 1].requiredScore);
        require(TFHE.decrypt(scoreMatch), "Skill score too low");

        matches.push(Match({
            developerId: developerIndex + 1,
            jobId: jobId,
            isConfirmed: false,
            isCompleted: false
        }));

        matchCount++;

        emit MatchFound(developerIndex + 1, jobId, matchCount);
    }

    function confirmMatch(uint256 matchId) external {
        require(matchId > 0 && matchId <= matchCount, "Invalid match ID");
        
        Match storage match = matches[matchId - 1];
        Job storage job = jobs[match.jobId - 1];
        
        require(job.employer == msg.sender, "Not the employer");
        require(!match.isConfirmed, "Already confirmed");

        match.isConfirmed = true;
        job.isOpen = false;

        emit MatchConfirmed(matchId);
    }

    function getDeveloperSkillScore(address developer) external view returns (bytes memory) {
        uint256 developerId = developerIds[developer];
        require(developerId > 0, "Developer not found");
        
        Developer storage dev = developers[developerId - 1];
        return TFHE.reencrypt(dev.skillScore, msg.sender);
    }

    function getJobRequiredScore(uint256 jobId) external view returns (bytes memory) {
        require(jobId > 0 && jobId <= jobCount, "Invalid job ID");
        
        Job storage job = jobs[jobId - 1];
        require(job.employer == msg.sender, "Not the employer");
        
        return TFHE.reencrypt(job.requiredScore, msg.sender);
    }

    function getDeveloperCount() external view returns (uint256) {
        return developerCount;
    }

    function getJobCount() external view returns (uint256) {
        return jobCount;
    }

    function getMatchCount() external view returns (uint256) {
        return matchCount;
    }
}