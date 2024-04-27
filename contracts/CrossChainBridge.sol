// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// ECDSA library for signature verification
library ECDSA {
    function recover(
        bytes32 hash,
        bytes memory signature
    ) internal pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        require(signature.length == 65, "Invalid signature length");

        // Split the signature into its components
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        return ecrecover(hash, v, r, s);
    }

    function toEthSignedMessageHash(
        bytes32 hash
    ) internal pure returns (bytes32) {
        // Prefix the hash to mimic the behavior of the eth_sign RPC call
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
            );
    }
}

// Interface for the token contract
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);
}

contract CrossChainBridge {
    address public owner;
    address public tokenAddress;
    mapping(bytes32 => bool) public usedHashes;

    event TokensLocked(
        address indexed from,
        uint256 amount,
        bytes32 indexed lockHash,
        uint256 indexed destinationChainId,
        address destinationContract
    );
    event TokensUnlocked(
        address indexed to,
        uint256 amount,
        bytes32 indexed lockHash,
        uint256 indexed sourceChainId,
        address sourceContract
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function to initialize the token address
    function initializeTokenAddress(address _tokenAddress) external onlyOwner {
        require(tokenAddress == address(0), "Token address already set");
        tokenAddress = _tokenAddress;
    }

    // Function to lock tokens on this chain
    function lockTokens(
        uint256 amount,
        uint256 destinationChainId,
        address destinationContract
    ) external returns (bytes32) {
        require(amount > 0, "Amount must be greater than zero");
        require(
            destinationContract != address(0),
            "Invalid destination contract address"
        );

        require(
            IERC20(tokenAddress).transferFrom(
                msg.sender,
                address(this),
                amount
            ),
            "Transfer failed"
        );

        bytes32 lockHash = keccak256(
            abi.encodePacked(
                msg.sender,
                tokenAddress,
                amount,
                destinationChainId,
                destinationContract,
                block.timestamp
            )
        );
        emit TokensLocked(
            msg.sender,
            amount,
            lockHash,
            destinationChainId,
            destinationContract
        );
        return lockHash;
    }

    // Function to unlock tokens on another chain
    function unlockTokens(
        address to,
        uint256 amount,
        bytes32 lockHash,
        uint256 sourceChainId,
        address sourceContract,
        bytes memory signature
    ) external {
        require(!usedHashes[lockHash], "Hash already used");

        if (signature.length > 0) {
            require(
                verifySignature(lockHash, signature, owner),
                "Invalid signature"
            );
        }

        usedHashes[lockHash] = true;
        require(IERC20(tokenAddress).transfer(to, amount), "Transfer failed");
        emit TokensUnlocked(
            to,
            amount,
            lockHash,
            sourceChainId,
            sourceContract
        );
    }

    // Function to withdraw tokens locked on this chain
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        require(
            IERC20(tokenAddress).transfer(owner, amount),
            "Transfer failed"
        );
    }

    // Function to approve spending tokens by this contract
    function approve(address spender, uint256 amount) external onlyOwner {
        IERC20(tokenAddress).approve(spender, amount);
    }

    // Function to check the user Balance
    function balanceOf(address account) external view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(account);
    }

    function checkAllowance(address _spender) external view returns (uint256) {
        return IERC20(tokenAddress).allowance(msg.sender, _spender);
    }

    // Function to verify signature
    function verifySignature(
        bytes32 hash,
        bytes memory signature,
        address signer
    ) internal pure returns (bool) {
        address recoveredSigner = ECDSA.recover(
            ECDSA.toEthSignedMessageHash(hash),
            signature
        );
        return recoveredSigner == signer;
    }
}
