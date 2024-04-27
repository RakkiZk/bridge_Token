# bridge_Token
 To implement a  smart contract that allows users to lock tokens on one chain and unlock them on another chain

## Prerequisites
Before deploying your contract using Hardhat, ensure you have the following installed:
- Node.js and npm (Node Package Manager)
- Hardhat (globally or locally)
- Solidity compiler (automatically installed by Hardhat)
- Ethereum network provider (e.g., localhost, arbitrum sepolia, sepolia, etc.)

## Steps

1. **Install Dependencies**
   
   If you haven't already, install Hardhat and other project dependencies by running:
   ```bash
   npm install --save-dev hardhat

2. **Compiling contracts**

    To compile your contracts in your Hardhat project, use the built-in compile task:
    ```bash
    npx hardhat compile

3. **Run Deployments**

    Execute your deployment ignition using Hardhat. For example, to deploy to the arbitrum sepolia and sepolia  network:
        ```bash
    npx hardhat run --network <"Network"> ignition/deploy.js
