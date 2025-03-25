module.exports = {
  // Networks configuration for Truffle to connect to Ethereum networks
  networks: {
    // Development network for Ganache
    development: {
      host: "127.0.0.1",    // Localhost (Ganache default)
      port: 7545,           // Ganache default RPC port
      network_id: "5777",   // Ganache network ID (default is 5777)
      gas: 6721975,         // Maximum gas per transaction (default is 6721975)
      gasPrice: 20000000000, // 20 Gwei gas price (default is 100 Gwei)
    },
  },

  // Compiler configuration to specify the Solidity version
  compilers: {
    solc: {
      version: "0.8.0",      // Use the Solidity version you are using
      settings: {
        optimizer: {
          enabled: true,     // Enable the optimizer for gas usage efficiency
          runs: 200,         // Number of optimization runs (default is 200)
        },
      },
    },
  },

  // Optional configuration for Truffle DB (disabled by default)
  // db: {
  //   enabled: false,       // Disable Truffle DB (it is disabled by default)
  // },

  // Mocha testing configuration (you can set a timeout here if necessary)
  mocha: {
    // timeout: 100000,    // Uncomment to set a custom timeout for tests
  },

  // Additional configuration for networks like Infura, if needed later
  // For example, if you need to deploy to Goerli or Rinkeby
  // goerli: {
  //   provider: () => new HDWalletProvider(MNEMONIC, `https://goerli.infura.io/v3/YOUR_PROJECT_ID`),
  //   network_id: 5,       // Goerli network ID
  //   confirmations: 2,    // Wait for 2 confirmations
  //   timeoutBlocks: 200,  // Timeout after 200 blocks
  //   skipDryRun: true,    // Skip dry-run before deployment
  // },
};
