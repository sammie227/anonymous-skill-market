const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Anonymous Skill Market contracts...");

  // Deploy SkillEvaluator first
  const SkillEvaluator = await ethers.getContractFactory("SkillEvaluator");
  const skillEvaluator = await SkillEvaluator.deploy();
  await skillEvaluator.waitForDeployment();
  console.log("SkillEvaluator deployed to:", await skillEvaluator.getAddress());

  // Deploy SkillMarket
  const SkillMarket = await ethers.getContractFactory("SkillMarket");
  const skillMarket = await SkillMarket.deploy();
  await skillMarket.waitForDeployment();
  console.log("SkillMarket deployed to:", await skillMarket.getAddress());

  // Save deployment addresses
  const deploymentInfo = {
    SkillMarket: await skillMarket.getAddress(),
    SkillEvaluator: await skillEvaluator.getAddress(),
    network: process.env.HARDHAT_NETWORK || "localhost",
    deployedAt: new Date().toISOString()
  };

  console.log("\nDeployment completed!");
  console.log("Contracts deployed:", deploymentInfo);

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });