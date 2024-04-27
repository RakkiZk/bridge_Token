const { ethers } = require("hardhat");

async function main() {
  // Deploying the CrossChainBridge contract
  const CrossChainBridge = await ethers.getContractFactory("CrossChainBridge");
  const crossChainBridge = await CrossChainBridge.deploy();

  console.log("CrossChainBridge contract deployed to:", crossChainBridge.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });
