// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract SkillEvaluator is SepoliaConfig {

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
            complexityScore: FHE.asEuint32(0),
            securityScore: FHE.asEuint32(0),
            qualityScore: FHE.asEuint32(0),
            finalScore: FHE.asEuint32(0),
            timestamp: block.timestamp,
            isEvaluated: false
        }));

        submissionCount++;
        developerSubmissions[msg.sender].push(submissionCount);

        emit CodeSubmitted(msg.sender, submissionCount, codeHash);
    }

    function evaluateCode(
        uint256 submissionId,
        externalEuint32 encryptedComplexity,
        bytes memory complexityProof,
        externalEuint32 encryptedSecurity,
        bytes memory securityProof,
        externalEuint32 encryptedQuality,
        bytes memory qualityProof
    ) external onlyOwner {
        require(submissionId > 0 && submissionId <= submissionCount, "Invalid submission ID");
        
        CodeSubmission storage submission = submissions[submissionId - 1];
        require(!submission.isEvaluated, "Already evaluated");

        euint32 complexity = FHE.fromExternal(encryptedComplexity, complexityProof);
        euint32 security = FHE.fromExternal(encryptedSecurity, securityProof);
        euint32 quality = FHE.fromExternal(encryptedQuality, qualityProof);

        submission.complexityScore = complexity;
        submission.securityScore = security;
        submission.qualityScore = quality;

        euint32 weightedComplexity = FHE.mul(complexity, FHE.asEuint32(uint32(criteria.complexityWeight)));
        euint32 weightedSecurity = FHE.mul(security, FHE.asEuint32(uint32(criteria.securityWeight)));
        euint32 weightedQuality = FHE.mul(quality, FHE.asEuint32(uint32(criteria.qualityWeight)));

        submission.finalScore = FHE.add(FHE.add(weightedComplexity, weightedSecurity), weightedQuality);

        submission.isEvaluated = true;

        emit CodeEvaluated(submissionId, "");
    }

    function getSubmissionScore(uint256 submissionId) external view returns (bytes memory) {
        require(submissionId > 0 && submissionId <= submissionCount, "Invalid submission ID");
        
        CodeSubmission storage submission = submissions[submissionId - 1];
        require(submission.developer == msg.sender || msg.sender == owner, "Unauthorized");
        require(submission.isEvaluated, "Not evaluated yet");

        return "";
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

        return "";
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