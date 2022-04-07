// import { subtask, task, types } from "hardhat/internal/core/config/config-env";
const path = require("path");
const { subtask, task, types } = require("hardhat/internal/core/config/config-env");
const glob = require("glob");

require('dotenv').config()
require('@nomiclabs/hardhat-etherscan')
require('@nomiclabs/hardhat-ethers')
require("@nomiclabs/hardhat-web3");
require('hardhat-tracer')
require('hardhat-log-remover')
require('hardhat-abi-exporter')
require('hardhat-deploy')
require('hardhat-contract-sizer');
require("hardhat-gas-reporter");
//Shorthand (hh) and autocomplete, makes hh === npx hardhat
//on windows, must rename C:\Windows\hh.exe to something else
//https://www.partitionwizard.com/partitionmagic/you-require-permission-from-trustedinstaller.html
//npm i -g hardhat-shorthand

// const chainIds = {ropsten: 3, testnet: 97, mainnet: 56, localhost:31337}
const {
  ETHERSCAN_API_KEY,
  optsEtherscan,
  optsNetworks,
  uniSwapCompilers,
  namedAccountsTestnet,
  namedAccountsHH,
  getApiUrl
} = require('./hardhat.secrets')


task("accounts", "Prints accounts", async (_, {web3}) => {
  console.log(await web3.eth.getAccounts());
});

const hhOptions = {
  defaultNetwork: 'mainnet',
  networks: {
    ...optsNetworks
  },
  chains: {
    mainnet: 1,
    ropsten: 3,
    rinkeby: 4,
    goerli: 5,
    kovan: 42,
    testnet: 97,
    localhost: 31337
  },
  solidity: {
    compilers: [
      ...uniSwapCompilers,
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
    deploy: './deploy',
    deployments: './deployments'
  },
  ...optsEtherscan,
  abiExporter: {
    path: './abi',
    clear: true,
    flat: true,
    only: [],
    spacing: 2
  },
  contractSizer: {
    alphaSort: true, //whether to sort results table alphabetically (default sort is by contract size) [false]
    disambiguatePaths: true, //whether to output contract sizes automatically after compilation [false]
    runOnCompile: false, //whether to output the full path to the compilation artifact (relative to the Hardhat root directory) [false]
    strict: false, //whether to throw an error if any contracts exceed the size limit [false]
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
  },
  getApiUrl:getApiUrl
}
module.exports = hhOptions;
