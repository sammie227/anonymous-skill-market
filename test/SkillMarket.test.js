const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkillMarket", function () {
  let skillMarket;
  let skillEvaluator;
  let owner;
  let developer;
  let employer;

  beforeEach(async function () {
    [owner, developer, employer] = await ethers.getSigners();

    const SkillEvaluator = await ethers.getContractFactory("SkillEvaluator");
    skillEvaluator = await SkillEvaluator.deploy();

    const SkillMarket = await ethers.getContractFactory("SkillMarket");
    skillMarket = await SkillMarket.deploy();
  });

  describe("Developer Registration", function () {
    it("Should register a developer with encrypted score", async function () {
      // Mock encrypted data (in real implementation, this would be properly encrypted)
      const encryptedScore = ethers.randomBytes(32);
      const encryptedSalary = ethers.randomBytes(32);

      await expect(
        skillMarket.connect(developer).registerDeveloper(encryptedScore, encryptedSalary)
      ).to.emit(skillMarket, "DeveloperRegistered");

      expect(await skillMarket.getDeveloperCount()).to.equal(1);
    });

    it("Should not allow duplicate registration", async function () {
      const encryptedScore = ethers.randomBytes(32);
      const encryptedSalary = ethers.randomBytes(32);

      await skillMarket.connect(developer).registerDeveloper(encryptedScore, encryptedSalary);

      await expect(
        skillMarket.connect(developer).registerDeveloper(encryptedScore, encryptedSalary)
      ).to.be.revertedWith("Already registered");
    });
  });

  describe("Job Posting", function () {
    it("Should post a job with encrypted requirements", async function () {
      const encryptedScore = ethers.randomBytes(32);
      const encryptedSalary = ethers.randomBytes(32);
      const description = "Senior Solidity Developer";

      await expect(
        skillMarket.connect(employer).postJob(encryptedScore, encryptedSalary, description)
      ).to.emit(skillMarket, "JobPosted");

      expect(await skillMarket.getJobCount()).to.equal(1);
    });
  });

  describe("Code Evaluation", function () {
    it("Should submit code for evaluation", async function () {
      const codeHash = "QmTestHash123";

      await expect(
        skillEvaluator.connect(developer).submitCode(codeHash)
      ).to.emit(skillEvaluator, "CodeSubmitted");

      expect(await skillEvaluator.getSubmissionCount()).to.equal(1);
    });

    it("Should not allow duplicate code submission", async function () {
      const codeHash = "QmTestHash123";

      await skillEvaluator.connect(developer).submitCode(codeHash);

      await expect(
        skillEvaluator.connect(developer).submitCode(codeHash)
      ).to.be.revertedWith("Code already submitted");
    });
  });
});