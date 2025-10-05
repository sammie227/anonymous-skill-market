# Anonymous Skill Certification Marketplace

A privacy-preserving platform for developers to showcase their coding skills and get matched with job opportunities using Fully Homomorphic Encryption (FHE).

## 🎯 Project Overview

This project implements an anonymous skill certification marketplace where:
- Developers submit code for evaluation without revealing their identity
- AI analyzes code quality, security, and complexity
- Skill scores are encrypted using FHEVM (Fully Homomorphic Encryption Virtual Machine)
- Job matching happens on encrypted data, preserving privacy
- Employers can find qualified candidates without seeing personal details

## ✨ Key Features

### For Developers
- **Anonymous Code Submission**: Submit Solidity smart contracts for evaluation
- **Encrypted Skill Scores**: Your scores are encrypted and only you can decrypt them
- **Private Job Matching**: Get matched with jobs based on encrypted criteria
- **Identity Protection**: Remain anonymous until you choose to reveal yourself

### For Employers
- **Privacy-Preserving Recruitment**: Post jobs with encrypted requirements
- **Skill-Based Matching**: Find candidates based on actual coding ability
- **Secure Evaluation**: Access encrypted skill scores for qualified matches

### Technical Innovation
- **FHE Implementation**: Uses Zama's FHEVM for computation on encrypted data
- **AI Code Analysis**: Automated evaluation of code quality, security, and complexity
- **Zero-Knowledge Proofs**: Prove skills without revealing sensitive information

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │────│  Smart Contracts │────│  Analysis API   │
│   (React)       │    │   (FHEVM/Sol)    │    │   (Node.js)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                           ┌──────────────┐
                           │  Zama FHEVM  │
                           │   Network    │
                           └──────────────┘
```

## 🛠️ Technology Stack

- **Blockchain**: Zama FHEVM (Fully Homomorphic Encryption)
- **Smart Contracts**: Solidity ^0.8.19
- **Frontend**: React.js + Material-UI
- **Backend**: Node.js + Express
- **Development**: Hardhat
- **Encryption**: TFHE (Threshold FHE)

## 📁 Project Structure

```
anonymous-skill-market/
├── contracts/                 # Smart contracts
│   ├── SkillMarket.sol       # Main marketplace contract
│   └── SkillEvaluator.sol    # Code evaluation contract
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   └── utils/           # Utility functions
│   └── public/
├── analysis-service/         # Code analysis API
│   └── src/
├── scripts/                  # Deployment scripts
├── test/                     # Contract tests
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MetaMask or compatible Web3 wallet
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd anonymous-skill-market
   ```

2. **Install dependencies**
   ```bash
   # Install contract dependencies
   npm install

   # Install frontend dependencies
   cd frontend && npm install

   # Install analysis service dependencies
   cd ../analysis-service && npm install
   ```

3. **Set up environment**
   ```bash
   # Copy and configure environment variables
   cp analysis-service/.env.example analysis-service/.env
   ```

### Development Setup

1. **Start the analysis service**
   ```bash
   cd analysis-service
   npm run dev
   ```

2. **Deploy smart contracts**
   ```bash
   # In the root directory
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Start the frontend**
   ```bash
   cd frontend
   npm start
   ```

4. **Access the application**
   Open http://localhost:3000 in your browser

## 🧪 Testing

### Run Smart Contract Tests
```bash
npx hardhat test
```

### Run Analysis Service Tests
```bash
cd analysis-service
npm test
```

## 📊 Evaluation Criteria

The AI analysis evaluates code based on:

- **Complexity (30%)**: Cyclomatic complexity, code structure, function count
- **Security (40%)**: Vulnerability detection, best practices compliance
- **Quality (30%)**: Documentation, code style, readability

## 🎮 Demo Workflow

1. **Developer Registration**
   - Connect wallet
   - Register with encrypted skill score and salary expectations

2. **Code Submission**
   - Submit Solidity smart contract
   - AI analyzes and generates encrypted score

3. **Job Matching**
   - View anonymized job listings
   - Apply to matched positions based on encrypted criteria

4. **Employer Workflow**
   - Post jobs with encrypted requirements
   - Review anonymous candidate matches
   - Confirm matches for further discussion

## 🔒 Privacy Features

- **End-to-End Encryption**: All sensitive data encrypted using FHE
- **Anonymous Matching**: Job matching without revealing identities
- **Selective Disclosure**: Choose what to reveal and when
- **Zero-Knowledge Proofs**: Prove qualifications without exposing details

## 🌟 Zama Developer Program Submission

This project is submitted to the Zama Developer Program and demonstrates:

✅ **Original Technical Architecture**: Novel use of FHE for recruitment
✅ **Working Demo Deployment**: Fully functional end-to-end system
✅ **Quality Implementation**: Comprehensive testing and documentation
✅ **Business Potential**: Addresses real privacy concerns in recruitment
✅ **FHE Innovation**: Meaningful application of homomorphic encryption

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Zama Documentation](https://docs.zama.ai/)
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Demo Video](# Link to demo video)
- [Live Demo](# Link to deployed demo)

## 📞 Contact

For questions about this project, please open an issue in the repository.

---

*Built with ❤️ for the Zama Developer Program*