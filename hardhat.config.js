require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

const { vars } = require("hardhat/config");

// Hardhat configuration variables (recommended by official docs)
const MNEMONIC = vars.get("MNEMONIC", "test test test test test test test test test test test junk");
const INFURA_API_KEY = vars.get("INFURA_API_KEY", "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Local development network
    hardhat: {
      accounts: {
        mnemonic: MNEMONIC,
        count: 10
      }
    },
    // Zama FHEVM Devnet
    zama: {
      url: "https://devnet.zama.ai/",
      accounts: {
        mnemonic: MNEMONIC,
        count: 10
      },
      chainId: 8009
    },
    // Sepolia testnet (for comparison/backup)
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: {
        mnemonic: MNEMONIC,
        count: 10
      },
      chainId: 11155111
    }
  },
  namedAccounts: {
    deployer: 0,
    alice: 1,
    bob: 2
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};