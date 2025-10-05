// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "fhevm/lib/TFHE.sol";

contract SkillEvaluator {
    using TFHE for euint32;
    using TFHE for euint8;
    using TFHE for ebool;

    struct CodeSubmission {
        address developer;
        string codeHash;
        euint32 complexityScore;
        euint32 securityScore;
        euint32 qualityScore;
        euint32 finalScore;
        uint256 timestamp;
        bool isEvaluated;
    }

    struct EvaluationCriteria {
        uint256 complexityWeight;
        uint256 securityWeight;
        uint256 qualityWeight;
        uint256 maxScore;
    }

    mapping(address => uint256[]) public developerSubmissions;
    mapping(string => bool) public codeHashExists;
    
    CodeSubmission[] public submissions;
    EvaluationCriteria public criteria;
    
    address public owner;
    uint256 public submissionCount;

    event CodeSubmitted(address indexed developer, uint256 submissionId, string codeHash);
    event CodeEvaluated(uint256 submissionId, bytes encryptedScore);
    event CriteriaUpdated(uint256 complexityWeight, uint256 securityWeight, uint256 qualityWeight);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
        criteria = EvaluationCriteria({
            complexityWeight: 30,
            securityWeight: 40,
            qualityWeight: 30,
            maxScore: 100
        });
    }

    function submitCode(string memory codeHash) external {
        require(!codeHashExists[codeHash], "Code already submitted");
        require(bytes(codeHash).length > 0, "Invalid code hash");

        codeHashExists[codeHash] = true;

        submissions.push(CodeSubmission({
            developer: msg.sender,
            codeHash: codeHash,
            complexityScore: TFHE.asEuint32(0),
            securityScore: TFHE.asEuint32(0),
            qualityScore: TFHE.asEuint32(0),
            finalScore: TFHE.asEuint32(0),
            timestamp: block.timestamp,
            isEvaluated: false
        }));

        submissionCount++;
        developerSubmissions[msg.sender].push(submissionCount);

        emit CodeSubmitted(msg.sender, submissionCount, codeHash);
    }

    function evaluateCode(
        uint256 submissionId,
        bytes calldata encryptedComplexity,
        bytes calldata encryptedSecurity,
        bytes calldata encryptedQuality
    ) external onlyOwner {
        require(submissionId > 0 && submissionId <= submissionCount, "Invalid submission ID");
        
        CodeSubmission storage submission = submissions[submissionId - 1];
        require(!submission.isEvaluated, "Already evaluated");

        euint32 complexity = TFHE.asEuint32(encryptedComplexity);
        euint32 security = TFHE.asEuint32(encryptedSecurity);
        euint32 quality = TFHE.asEuint32(encryptedQuality);

        TFHE.allow(complexity, address(this));
        TFHE.allow(security, address(this));
        TFHE.allow(quality, address(this));

        submission.complexityScore = complexity;
        submission.securityScore = security;
        submission.qualityScore = quality;

        euint32 weightedComplexity = TFHE.mul(complexity, TFHE.asEuint32(criteria.complexityWeight));
        euint32 weightedSecurity = TFHE.mul(security, TFHE.asEuint32(criteria.securityWeight));
        euint32 weightedQuality = TFHE.mul(quality, TFHE.asEuint32(criteria.qualityWeight));

        euint32 totalWeighted = TFHE.add(TFHE.add(weightedComplexity, weightedSecurity), weightedQuality);
        submission.finalScore = TFHE.div(totalWeighted, TFHE.asEuint32(100));

        TFHE.allow(submission.finalScore, submission.developer);
        submission.isEvaluated = true;

        bytes memory encryptedScore = TFHE.reencrypt(submission.finalScore, submission.developer);
        emit CodeEvaluated(submissionId, encryptedScore);
    }

    function getSubmissionScore(uint256 submissionId) external view returns (bytes memory) {
        require(submissionId > 0 && submissionId <= submissionCount, "Invalid submission ID");
        
        CodeSubmission storage submission = submissions[submissionId - 1];
        require(submission.developer == msg.sender || msg.sender == owner, "Unauthorized");
        require(submission.isEvaluated, "Not evaluated yet");

        return TFHE.reencrypt(submission.finalScore, msg.sender);
    }

    function getDeveloperSubmissions(address developer) external view returns (uint256[] memory) {
        return developerSubmissions[developer];
    }

    function getLatestScore(address developer) external view returns (bytes memory) {
        uint256[] memory userSubmissions = developerSubmissions[developer];
        require(userSubmissions.length > 0, "No submissions found");

        uint256 latestSubmissionId = userSubmissions[userSubmissions.length - 1];
        CodeSubmission storage submission = submissions[latestSubmissionId - 1];
        require(submission.isEvaluated, "Latest submission not evaluated");

        return TFHE.reencrypt(submission.finalScore, msg.sender);
    }

    function updateCriteria(
        uint256 _complexityWeight,
        uint256 _securityWeight,
        uint256 _qualityWeight
    ) external onlyOwner {
        require(_complexityWeight + _securityWeight + _qualityWeight == 100, "Weights must sum to 100");
        
        criteria.complexityWeight = _complexityWeight;
        criteria.securityWeight = _securityWeight;
        criteria.qualityWeight = _qualityWeight;

        emit CriteriaUpdated(_complexityWeight, _securityWeight, _qualityWeight);
    }

    function getSubmissionCount() external view returns (uint256) {
        return submissionCount;
    }

    function getCriteria() external view returns (EvaluationCriteria memory) {
        return criteria;
    }
}