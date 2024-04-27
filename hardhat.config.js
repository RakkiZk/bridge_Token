require('@nomicfoundation/hardhat-toolbox');

const PRIVATE_KEY = '95cd7913d8db3bd75025e53e7774b8ece65578a1355453d8597e2877fe44d535'; 

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
