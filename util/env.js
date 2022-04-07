const hre = require("hardhat");
const rc = require.main.runcommands;
const {ethers, web3} = hre;
const { BigNumber, provider } = ethers;
const { MaxUint256 } = ethers.constants;
const { parseEther, parseUnits, formatUnits, defaultAbiCoder,hexValue  } = ethers.utils;
const JSON_WETH9 = require("@uniswap/v2-periphery/build/WETH9.json");
const JSON_UniV2Factory = require("@uniswap/v2-core/build/UniswapV2Factory.json");
const JSON_UniV2Router01 = require("@uniswap/v2-periphery/build/UniswapV2Router01.json");
const JSON_UniV2Router02 = require("@uniswap/v2-periphery/build/UniswapV2Router02.json");
const JSON_UniV2Pair = require("@uniswap/v2-core/build/UniswapV2Pair.json");
const _ = require('lodash');
const [__,__E] = [console.log,console.error];
const {last4, sExp,_toBN,sRnd,sMul,hrExp,sAbs} = require("./zmath");
const {appendToLog,setActive,getActive,} = require("./fsUtils");
// exported globalsw
let aaaa={label:'aaaa'}, bbbb={label:'bbbb'}, cccc={label:'cccc'},
  dddd={label:'dddd'}, eeee={label:'eeee'}, ffff={label:'ffff'},
  h1={label:'h1'}, h2={label:'h2'}, h3={label:'h3'}, h4={label:'h4'},
  accounts=[],a={},i={},addr={},gcf={},gVals={},chainId,getGasPrice;
// local globals
const allGasLimits = {
  hardhat:'30000000', ropsten:'4512788', rinkeby:'29000000', mainnet:'14512788',
};
let opts = {//defaults, do not change here
  use:[/*'uni','flowx','fxutils','mocky','sandbox'*/],
  uniswap:{precomp:true, sourceSet:1},
  inst:{
    weth: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
    factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    flowx:'',
    fswap:'new',
    fxutils:'new',
    mocky:'new',
    sandbox:'new',
    rwds:'new',
  },
  network:'hardhat',
  source:'./contracts'
}
async function initEnv(){
  _.merge(opts, rc);//rc clobbers opts
  _.merge(rc, opts);//fill remainder into rc
  await hre.run('compile');
  if(opts.network==='hardhat') {
    await hre.network.provider.send("evm_setIntervalMining", [1000]);
  }
  chainId = await hre.getChainId();
  getGasPrice = formatUnits(await provider.getGasPrice(), "wei");
  gVals.gasPrice = getGasPrice;
  gVals.gasLimit = allGasLimits[opts.network]
  await setAccounts().then(async()=>{
    for(let v of opts.use){
      await init[v]();
    }
  })
  setInstanceLabels();
  // hre.config.i = i;
}
async function setAccounts(){
  const GNA = await hre.getNamedAccounts();
  Object.assign(addr,GNA);
  accounts = await ethers.getSigners();
  [aaaa, bbbb, cccc, dddd, eeee, ffff, h1, h2, h3, h4]
  .forEach((vv,ii,aa)=>{
    if(!GNA[vv.label]){vv=null;}else{
      _.assign(vv, accounts.filter(acc=>acc.address===GNA[vv.label])[0])
      vv.last4=last4(vv.address);
      vv.a=vv.address;
      a[vv.label]=vv
    }
  })
}
function getAccts(){
  return [a.aaaa, a.bbbb, a.cccc, a.h1, a.h2, a.h3, a.h4 ];
}
function setInstanceLabels(){
  Array.from(Object.entries(i)).forEach(([k,v],ii)=>{
    i[k].label=k;
    i[k].last4=last4(v.address);
    i[k].a=v.address;
    i[k].cs=v.callStatic;
    __(`${k}:`, v.address);
  })
}

const init = {
  uni:async ()=>{
    async function uniInst(label, FqLabel, optsInstAddrOrNew, JSON){
      if(optsInstAddrOrNew==='new'||opts.network==='hardhat') {
        gcf[label] = opts.uniswap.precomp
          ? new ethers.ContractFactory(JSON.abi, JSON.bytecode, aaaa)
          : await ethers.getContractFactory(FqLabel);
        let args = label==='factory'?[aaaa.address]
          : label==='router'?[i.factory.address, i.weth.address]:[];
        await init._iFromNewDeploy(label, FqLabel, args)
      }else{
        await init._iFromContractAt(label, JSON.abi, optsInstAddrOrNew)
      }
    }
    await uniInst('weth', 'WETH9', opts.inst.weth, JSON_WETH9)
    await uniInst('factory', 'UniswapV2Factory', opts.inst.factory, JSON_UniV2Factory)
    await uniInst('router', 'UniswapV2Router02', opts.inst.router, JSON_UniV2Router02)
    gcf.pair = opts.uniswap.precomp
      ? new ethers.ContractFactory(JSON_UniV2Pair.abi, JSON_UniV2Pair.bytecode, aaaa)
      : await ethers.getContractFactory('UniswapV2Pair');
  },
  flowx:async (at)=>{
    if(i.router==null){await init.uni();}
    if(opts.inst.flowx==='new'||opts.network==='hardhat') {
      await init._iFromNewDeploy('flowx','FrogeX',[i.router.address, sExp(11_000_000_000,9)])
      await init._flowxPair({updateLogs:true})
      // await init._fswap({updateLogs:true})
    }else{
      at=opts.inst.flowx==='active'?getActive('flowx'):opts.inst.flowx
      await init._iFromContractAt('flowx','FrogeX', at)
      await init._flowxPair({updateLogs:false})
    }
  },
  _flowxPair:async ({updateLogs})=>{
    addr.flowxPair = await i.flowx.callStatic.getUniV2Pair();
    // __('addr.flowxPair: ',addr.flowxPair)
    if(opts.network==='hardhat'){
      i.flowxPair = await gcf.pair.attach(addr.flowxPair)
    }else{
      await init._iFromContractAt('flowxPair','IUniV2Pair', addr.flowxPair)
    }
    if(updateLogs && opts.network!=='hardhat'){
      let owner = await i.flowx.callStatic.owner();
      setActive('flowx',i.flowx.address)
      setActive('flowxOwner',owner)
      setActive('flowxPair',i.flowxPair.address)
      appendToLog({
        'NewFlowXDeploy': i.flowx.address,network:opts.network,
        'owner':owner, 'pair':i.flowxPair.address,
      })
    }
  },
  fxutils:async (at)=>{
    if(i.router==null){await init.uni();}
    if(opts.inst.fxutils==='new'||opts.network==='hardhat') {
      await init._iFromNewDeploy('fxutils','FxUtils')
      let owner = await i.fxutils.callStatic.owner();
      if(opts.network!=='hardhat') {
        appendToLog({
          'NewFxUtilsDeploy': i.fxutils.address, 'owner': owner,
          network: opts.network,
        });
        setActive('fxutils', i.fxutils.address)
      }
    }else{
      at=opts.inst.fxutils==='active'?getActive('fxutils'):opts.inst.fxutils
      await init._iFromContractAt('fxutils','FxUtils', at)
    }
  },
  mocky:async (at)=>{
    if(opts.inst.mocky==='new'||opts.network==='hardhat') {
      await init._iFromNewDeploy('mocky','MockyToken')
    }else{
      at=opts.inst.mocky==='active'?getActive('mocky'):opts.inst.mocky
      await init._iFromContractAt('mocky','MockyToken', at)
    }
  },
  sandbox:async ()=>{
    if(opts.inst.sandbox==='new'||opts.network==='hardhat') {
      await init._iFromNewDeploy('sandbox','sandbox')
    }else if(opts.inst.sandbox.length===42){
      await init._iFromContractAt('sandbox','sandbox', opts.inst.sandbox)
    }
  },
  froge:async ()=>{
    if(opts.inst.froge&&opts.inst.froge.length===42){
      await init._iFromContractAt('froge','froge', opts.inst.froge)
    }else if(opts.inst.froge==='new'||opts.network==='hardhat') {
      await init._iFromNewDeploy('froge','froge')
    }
  },
  frogebsc:async ()=>{
    if(opts.inst.frogebsc&&opts.inst.frogebsc.length===42){
      await init._iFromContractAt('frogebsc','frogebsc', opts.inst.frogebsc)
    }else if(opts.inst.frogebsc==='new'||opts.network==='hardhat') {
      await init._iFromNewDeploy('frogebsc','frogebsc')
    }
  },
  fx8700:async ()=>{
    if(opts.inst.fx8700&&opts.inst.fx8700.length===42){
      await init._iFromContractAt('fx8700','FrogeX', opts.inst.fx8700)
    }else if(opts.inst.fx8700==='new'||opts.network==='hardhat') {
      await init._iFromNewDeploy('fx8700','FrogeX')
    }
  },
  rwds:async ()=>{
    if(opts.inst.rwds==='new'||opts.network==='hardhat') {
      await init._iFromNewDeploy('rwds','rwds')
    }else if(opts.inst.rwds.length===42){
      await init._iFromContractAt('rwds','rwds', opts.inst.rwds)
    }
  },
  _iFromContractAt:async (label,FqLabelOrABI,atAddr)=>{
    i[label] = await ethers.getContractAt(FqLabelOrABI, atAddr);
    await i[label].deployed();addr[label]=i[label].address;
    return i[label];
  },
  _iFromNewDeploy:async (label,FqLabel,deployArgs=[])=>{
    let costTrigger = await init.getCostFromEthDiff();
    if(gcf[label]==null){gcf[label] = await ethers.getContractFactory(FqLabel, aaaa);}
    // const dData = gcf[label].interface.encodeDeploy(deployArgs);
    // const estGas = await ethers.provider.estimateGas({ data: dData });
    i[label] = await gcf[label].deploy(...deployArgs);
    await i[label].deployTransaction.wait();
    // await i[label].deployed();
    addr[label]=i[label].address;
    __(`new deploy ${label} at ${i[label].address}`)
    __('deploycost: $',await costTrigger())
    return i[label];
  },
  _estDeployGas:async (label,FqLabel,deployArgs=[])=>{
    const dData = contract.interface.encodeDeploy([]);
    const estGas = await ethers.provider.estimateGas({ data: dData });
  },
  getCostFromEthDiff:async()=>{
    let ethA = await provider.getBalance(aaaa.a)
    return async ()=>{
      let ethB = await provider.getBalance(aaaa.a)
      let ethDiff = ethB - ethA;
      let costEth= sAbs(sRnd(hrExp(ethDiff,-18),-7))
      let costUSD= sRnd(sMul(costEth, '4000',-4),-3)
      return costUSD;
    }
  },

}
const oovAddresses = {
  aaaa: "0xb41bf98ff97453661a21dc99c8f0a655e30baaaa",
  bbbb: "0x36c695ed875658ee9e87226b002e64ed8102bbbb",
  cccc: "0x6c8afec8e9d22016ad5d22457a07913b899dcccc",
  dddd: "0x5e9aff74c382335a7ccd7e6b31e0982b6750dddd",
  chtywallet: "0xb849fBBfB25b679ADdFAD5Ebe94132c9ec7803aa",
  mktgwallet: "0xF2d5C58cB49148D7cFC00E833328f15D92e95fdC",
  FTPLiqLock: "0x3Fcc7d2decE3750427Aa2a6454c1f1FE6d7B1c92",
  UniLiqLock: "0xdBc5b192652178e2f35f48583241d9b50C8d8FB9",
  ref__deployerDev1: "0x1eE134E4Fccd51aEbB0B2d1e475ae4f57d41ac70",
  weth: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
}
let bals = {
  flowx:     {eth:'0',fx:'0',xAD:'0',/*xMDC:'0',xETD:'0',xWTD:'0',xDPS:'0',*/TS:'0',xTS:'0',fxP:'0',xGTD:'0'},
  flowxPair:{weth:'0',fx:'0',xAD:'0',/*xMDC:'0',xETD:'0',xWTD:'0',*/fxP:'0',},
  aaaa:      {eth:'0',fx:'0',xAD:'0',/*xMDC:'0',xETD:'0',xWTD:'0',*/fxP:'0',},
  bbbb:      {eth:'0',fx:'0',xAD:'0',/*xMDC:'0',xETD:'0',xWTD:'0',*/fxP:'0',},
  h1:        {eth:'0',fx:'0',xAD:'0',/*xMDC:'0',xETD:'0',xWTD:'0',*/fxP:'0',},
  h2:        {eth:'0',fx:'0',xAD:'0',/*xMDC:'0',xETD:'0',xWTD:'0',*/fxP:'0',},
  h3:        {eth:'0',fx:'0',xAD:'0',/*xMDC:'0',xETD:'0',xWTD:'0',*/fxP:'0',},
  h4:        {eth:'0',fx:'0',xAD:'0',/*xMDC:'0',xETD:'0',xWTD:'0',*/fxP:'0',},
}

module.exports = {
  accounts,getAccts, aaaa, bbbb, cccc, dddd, eeee, ffff, h1, h2, h3, h4,
  initEnv, i, a, addr, gcf, gVals, chainId,getGasPrice,allGasLimits,
  ethers, web3, BigNumber, provider, MaxUint256,oovAddresses,bals,
  parseEther, parseUnits, formatUnits, defaultAbiCoder, hexValue,
  JSON_WETH9,JSON_UniV2Factory,JSON_UniV2Router01,JSON_UniV2Router02,JSON_UniV2Pair
}
