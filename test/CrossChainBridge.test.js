// test/CrossChainBridge.test.js
const { expect } = require('chai');

describe('CrossChainBridge', function () {
  let owner, user1, user2;
  let token, crossChainBridge;

  before(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory('0xAc4FF8E1b670cbE24175fd133cd1E45FfE94251d');
    token = await Token.deploy();

    const CrossChainBridge = await ethers.getContractFactory('CrossChainBridge');
    crossChainBridge = await CrossChainBridge.deploy();

    // Initialize token address
    await crossChainBridge.initializeTokenAddress(token.address);
  });

  it('Should lock tokens', async function () {
    const amount = 100;
    const destinationChainId = 11155111; 
    const destinationContract = user1.address; 
    await token.connect(user1).approve(crossChainBridge.address, amount);
    const lockHash = await crossChainBridge.connect(user1).lockTokens(amount, destinationChainId, destinationContract);

    expect(lockHash).to.exist;
  });

  it('Should unlock tokens with signature', async function () {
    const amount = 100;
    const lockHash = '0x079109929ac48719c9e83783f7ddeaf15d908e2ecad7471b78c8ab8d0d029388'; 
    const sourceChainId = 421614; 
    const sourceContract = user1.address; 
    const signature = '0x96480e1f7c49d0adbc54d5a0179c5372130ac8f0f0755e2dd3e9f418a0d9bfa90bb2ed87ac8b41a12f96ee2ac924141c0a5d991b1a0eb34908d592a499d3500d1c'; 

    await expect(
      crossChainBridge.connect(owner).unlockTokens(user2.address, amount, lockHash, sourceChainId, sourceContract, signature)
    ).to.emit(crossChainBridge, 'TokensUnlocked');
  });

  it('Should withdraw tokens', async function () {
    const amount = 100;

    await expect(
      crossChainBridge.connect(owner).withdrawTokens(amount)
    ).to.emit(token, 'Transfer').withArgs(crossChainBridge.address, owner.address, amount);
  });

  it('Should approve spending tokens', async function () {
    const spender = user1.address;
    const amount = 100;

    await expect(
      crossChainBridge.connect(owner).approve(spender, amount)
    ).to.emit(token, 'Approval').withArgs(owner.address, spender, amount);
  });

  it('Should check user balance', async function () {
    const balance = await crossChainBridge.balanceOf(owner.address);
    expect(balance).to.exist;
  });

  it('Should check allowance', async function () {
    const spender = user1.address;
    const allowance = await crossChainBridge.checkAllowance(spender);
    expect(allowance).to.exist;
  });

});
