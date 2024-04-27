require('@nomicfoundation/hardhat-toolbox');

const PRIVATE_KEY = ''; 

module.exports = {
  networks: {
    arbitrum: {
      url: `https://arbitrum-sepolia.infura.io/v3/90f72622a4a14791b9166ec40c308044`,
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/90f72622a4a14791b9166ec40c308044`,
      accounts: [PRIVATE_KEY],
    },
  },
  solidity: '0.8.19',
};
