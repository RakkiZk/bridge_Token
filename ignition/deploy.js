// scripts/deploy.js
async function main() {
  // Hardhat setup
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy CrossChainBridge contract
  const CrossChainBridge = await ethers.getContractFactory("CrossChainBridge");
  const crossChainBridge = await CrossChainBridge.deploy();

  await crossChainBridge.deployed(); // Wait for the contract to be mined

  console.log("CrossChainBridge deployed to:", crossChainBridge.address);
}

// Execute the deployment script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
