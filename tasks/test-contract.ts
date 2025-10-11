import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:test-skill-market", "Test the SkillMarket contract deployment")
  .addOptionalParam("address", "Optionally specify the SkillMarket contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const SkillMarketDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("SkillMarket");
    console.log(`SkillMarket: ${SkillMarketDeployment.address}`);

    const skillMarketContract = await ethers.getContractAt("SkillMarket", SkillMarketDeployment.address);

    const developerCount = await skillMarketContract.getDeveloperCount();
    const jobCount = await skillMarketContract.getJobCount();

    console.log(`Developer count: ${developerCount}`);
    console.log(`Job count: ${jobCount}`);
  });