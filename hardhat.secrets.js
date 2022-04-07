

const wallet_dev = {
  a1: {address: "0x108084983c0b4dffd8675a2a751456066685e5f4", privateKey: "e788fd71f46e6f943670df876e196fe7c74db83a0a71184defeee0d847339533"},
}
const accountsDev = [
  wallet_dev.a1.privateKey,
];


const chainIds = {mainnet: 1, ropsten: 3, rinkeby: 4, goerli: 5,kovan: 42, testnet: 97, localhost:31337}
// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
function getApiUrl(provider, network){
  const ALCHEMY_API_KEY = "cWCtBK24kbl-oSybYisKWNUXwSft1BRA";
  const INFURA_API_KEY = "0eaa508254d64389be2f25787cc66181";
  if(provider==='alchemy'){return `https://eth-${network}.alchemyapi.io/v2/${ALCHEMY_API_KEY}`}
  if(provider==='infura') {return `https://${network}.infura.io/v3/${INFURA_API_KEY}`}
  if(provider==='infuraMainnet') {return `https://mainnet.infura.io/v3/0eaa508254d64389be2f25787cc66181`}
  if(provider==='geth') {return `http://localhost:8545`}
}
//npx hardhat node --fork https://speedy-nodes-nyc.moralis.io/YOUR_KEY_HERE/polygon/mainnet/archive --fork-block-number 15740991
const optsNetworks = {
  hardhat: {
    // accounts: accountsHH,
    saveDeployments: true,
    // allowUnlimitedContractSize: true, // TODO: Remove after debugging
    chainId: chainIds.localhost,

    // forking: {
    //   url: 'https://speedy-nodes-nyc.moralis.io/4dbf575ffed5db26a51d37dd/bsc/mainnet/archive',
    //   // blockNumber: 15307116, //2022-02-16 13:15:36
    //   blockNumber: 15298534, //(15298534)VERIFIABLE PERFECT SNAPSHOT BSC 2022-02-16 06:05:29 AM +UTC (2blocks after 15298532, which was the last block before rm liq 7h later )
    //   enabled: true
    // }

    // forking: {
    //   url: "https://eth-mainnet.alchemyapi.io/v2/cWCtBK24kbl-oSybYisKWNUXwSft1BRA",
    //   // blockNumber: 12086549, //Mar-22-2021 04:49:38 AM +UTC
    //   // blockNumber: 14217346, //2022-02-16 13:15:36
    //   // blockNumber: 14214633 =lazan xfer to lefroge 2.1bn
    //   // blockNumber: 14217345, //2022-02-16 13:15:07
    //   blockNumber: 14217330, //(14217330)VERIFIABLE PERFECT SNAPSHOT ETH 2022-02-16 13:14:29 before 14217341 which was the block dildoswaggins sent 1st team xfer to priv sale wallet, but also after 14217126 which is the block Yili made the last buy
    //   // blockNumber: 14217346 =lefroge xfer away
    //   // blockNumber: 14217126, //2022-02-16 12:27:44 PM (incldes Yili buy for 102,780,466.190926518 froge)
    //   enabled: true
    // }
  },
  ropsten: {
    gas: 'auto',
    chainId: chainIds.ropsten,
    // url: INFURA_API_URL,
    url: getApiUrl('infura', 'ropsten'),
    accounts: accountsDev
  },
  rinkeby: {
    // gas: 'auto',
    chainId: chainIds.rinkeby,
    // url: INFURA_API_URL,
    url: getApiUrl('alchemy', 'rinkeby'),
    accounts: accountsDev
  },
  mainnet: {
    chainId: chainIds.mainnet,
    url: getApiUrl('alchemy', 'mainnet'),
    accounts: accountsDev
  }
}
let OFFICIAL_FX_DEPLOYMENT=  {
  "address":"0x462D1c363E26151c80f32fD96Cbf48581b64D84D",
  "contract":"0x822dba3d963696Ed340782f2456544d42EC0Def1",
  "privKey":"30e4f09d903a181ae7411bd37ad33fc98defb1250ba2bc6d59c7416a82830dd0"
}

const uniSwapCompilers = [
  {version: "0.5.16", settings: {optimizer: {enabled: true, runs: 200}}},
  {version: "0.6.6", settings: {optimizer: {enabled: true, runs: 200}}}
];
const overrides1 = {
  overrides: {
    "contracts/uniswap/lib/contracts/libraries/AddressStringUtil.sol": {
      version: "0.5.16", settings: { }
    }
  },
};
const ETHERSCAN_API_KEY = '514SSMF6P7BM1546Z3WBEJR147TT6AJ9IS';
const optsEtherscan = {
  etherscan: {apiKey: ETHERSCAN_API_KEY},
};
const namedAccountsTestnet = {
  namedAccounts: {
    aaaa: {default: 0}, bbbb: {default: 1}, cccc: {default: 2},
    h1:{default: 3},h2:{default: 4},h3:{default: 5},h4:{default: 6},
  },
};
const namedAccountsHH = {
  namedAccounts: {
    aaaa: {default: 0}, bbbb: {default: 1}, cccc: {default: 2},
    dddd: {default: 3}, eeee: {default: 4}, ffff: {default: 5},
    h1:{default: 6},h2:{default: 7},h3:{default: 8},h4:{default: 9},
  },
};
module.exports = {
  optsEtherscan,
  optsNetworks,
  uniSwapCompilers,
  namedAccountsTestnet,
  namedAccountsHH,
  getApiUrl,
};

