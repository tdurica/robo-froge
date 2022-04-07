const hre  = require("hardhat");
const {ethers} = hre;
const {last4}  = require("./zmath");
const {dp}  = require("./deep");
const path  = require("path");
const fsX  = require("fs-extra");
const fs  = require("fs");
const {aaaa,i,allGasLimits}  = require("./env");
const _  = require("lodash");

const ethScanURI = {
  tx: `https://${hre.network.name==='mainnet'?'':hre.network.name+'.'}etherscan.io/tx/`,
  addr: `https://${hre.network.name==='mainnet'?'':hre.network.name+'.'}etherscan.io/address/`,
};
const deadAddr = '0x000000000000000000000000000000000000dead';
const [__,__E,__W] = [console.log,console.error,console.warn];

/*
function SIM_getAmountOut(amountIn, type)  {//((x^fee * Y) / (X + x^fee)
  let [reserveIn,reserveOut]=type==='buy'?[bals.pair.eth,bals.pair.fx]:[bals.pair.fx,bals.pair.eth];
  let amountInWithFee = sMul(amountIn,997);
  let numerator = sMul(amountInWithFee,reserveOut);
  let denominator = sAdd(sMul(reserveIn,1000),amountInWithFee);
  let amountOut = sDiv(numerator, denominator);
  return amountOut;
}
function SIM_getAmountOut2(amountIn, type)  {//((x^fee * Y) / (X + x^fee)
  let [reserveIn,reserveOut]=type==='buy'?[bals.pair.eth,bals.pair.fx]:[bals.pair.fx,bals.pair.eth];
  let amountOut = sDiv(sMul(sMul(amountIn,997),reserveOut), sAdd(sMul(reserveIn,1000),sMul(amountIn,997)));
  return amountOut;
}
function SIM_expectedOut(inputA,type){
  let [reserveA,reserveB]=type==='buy'?[bals.pair.eth,bals.pair.fx]:[bals.pair.fx,bals.pair.eth];
  return sDiv(sMul(reserveB, inputA), (sAdd(reserveA, inputA)))  //Y * x / (X + x)
}
*/

function logTxError(error){
  __E('error.reason/code: ' + error.reason + ` ` + error.code);
  if(error.transaction){
    try{__E('error.transactionHash: ' + error.transactionHash);}catch(e){}
    try{__E('error.transaction: ' + JSON.stringify(error.transaction));}catch(e){}
    try{__E('tx.gasPrice: ' + error.transaction.gasPrice.toString());}catch(e){}
    try{__E('tx.gasLimit: ' + error.transaction.gasLimit.toString());}catch(e){}
    try{__E('tx.value: ' + error.transaction.value.toString());}catch(e){}
    try{__E('tx.effectiveGasPrice: ' + error.transaction.effectiveGasPrice.toString());}catch(e){}
    try{__E('tx.cumulativeGasUsed: ' + error.transaction.cumulativeGasUsed.toString());}catch(e){}
    try{__E('tx.gasUsed: ' + error.transaction.gasUsed.toString());}catch(e){}
    try{__E('tx.nonce: ' + error.transaction.nonce.toString());}catch(e){}
    try{__E(ethScanURI.tx + error.transactionHash);}catch(e){}
  }
}


function _catch(e,msg=''){
  __E(`err${msg?' '+msg:''}: `,e)
}
function ___pause___(ms=1000){return new Promise(r=>setTimeout(r,ms))}//await ___pause___();
const ___pressanykey___ = async (label='', err=0) => {
  if(err){console.warn(err)}
  console.log(`${label} press any key to continue...`)
  process.stdin.setRawMode(true)
  return new Promise(resolve => process.stdin.once('data', () => {
    process.stdin.setRawMode(false)
    resolve()
  }))
}
const tnPause=async()=>{
  if(rc.network!=='hardhat'){
    await ___pause___();
  }
}
function aori(addrOrInst){
  if(addrOrInst.address==null){
    return {
      last4:last4(addrOrInst),
      label:last4(addrOrInst),
      address:addrOrInst,
      a:addrOrInst,
    }
  }else{
    return addrOrInst
  }
}

const ss = {
  txCtr:1,
  mainnetGPrice: '245000000000',//245 gwei
  gVals: {gasPrice:'144000000000', gasLimit:allGasLimits[rc.network]},
  // gVals: {gasPrice:'77000000000', gasLimit:allGasLimits[rc.network]},
  // gVals: {gasPrice:20e9, gasLimit:allGasLimits[rc.network]},
  initTX:(__args,ss)=>{
    let [_sig,_user={}, _args=[], _msg='', _logLevel=0] = __args
    let split = _sig.split('.')
    ss.sig = _sig
    ss.s0 = split[0]
    ss.s1 = split[1]
    ss.cName = split[0]
    ss.mName = split[1]
    let rest = [_user, _args, _msg, _logLevel];
    ss.user = rest[0]._signer?rest[0]:aaaa;
    ss.args = rest.find(v=>Array.isArray(v));
    if(!ss.args){ss.args=[];}
    ss.formatTxArgs()
    //convert args when .address or number
    ss.msg = rest.find(v=>typeof(v)==='string');
    ss.label = `${ss.txCtr}_${ss.msg?ss.msg:_sig}`;
    ss.logLv = rest.find(v=>typeof(v)==='number');
    ss.logs=false;
    ss.dontWrite=[];
    // return [sig,user,args,msg,logLv,nConfirms]
  },
  formatTxArgs:()=>{
    let args = ss.args;
    args = ss.sanitizeTxArgs(args)
    if(args.length&&_.isObject(args.at(-1))) {
      Object.assign(args.at(-1),ss.gVals)
    }else{args.push(ss.gVals)}
  },
  sanitizeTxArgs:(args)=>{
    if(args.length){args.forEach((v,ii,a)=>{
      if(a[ii].address){a[ii]=a[ii].address}
      if(typeof(a[ii])==='number'){a[ii]=a[ii].toString()}
    })}return args;
  },
  setLogs:(rv={},c=0)=>{
    if(!ss.rcpt.logs.length){
      return ss.logs=false;
    }
    for (let log of ss.rcpt.logs) {
      let inst = Object.values(i).find(v=>v.address===log.address);
      if(!inst.interface.parseLog){continue;}
      let ld = inst.interface.parseLog(log)
      rv[`e${c++}_${ld.name}`]={
        name:ld.name,
        // signature:ld.signature, topic:ld.topic,
        args:dp.allBNToStr(ld.args),
      }
    }
    ss.logs = rv;
  },
  getTinyRcpt:()=>{
    let rcpt = _.cloneDeep(ss.rcpt)
    rcpt.gasUsed = rcpt.gasUsed.toString();
    delete rcpt.cumulativeGasUsed;
    // rcpt.effectiveGasPrice = rcpt.effectiveGasPrice.toString();
    delete rcpt.transactionIndex;delete rcpt.blockHash;
    delete rcpt.blockNumber;delete rcpt.confirmations;
    delete rcpt.logsBloom;delete rcpt.logs;
    delete rcpt.events;delete rcpt.status;delete rcpt.type;
    return rcpt;
  },
  notifyAwaitingTx:function(){
    let label=ss.label,tx=ss.tx;
    if(label && rc.network==='hardhat'){console.log(`> Awaiting "${label}" tx`);}
    else if(label){console.log(`> Awaiting "${label}" tx: ${tx.hash}`);}
    else if(rc.network==='hardhat'){console.log(`> Awaiting tx`);}
    else{console.log(`> Awaiting tx: ${tx.hash}`);}
  },
  reset:()=>{
    if(ss.label&&ss[ss.label]){delete ss[ss.label]}
    ['sig','s0','s1','cName','mName',
      'user','args','msg','label','logLv',
      'tx', 'rcpt', 'logs'
    ].forEach((v)=>ss[v]=false)
  },
}






export {
  __,__E,__W,ethScanURI, logTxError,_catch,ss,
  deadAddr, ___pressanykey___, ___pause___,tnPause,aori,
}

const cellar = {
  logEvents:async(logDatas, deployment, thisAddress)=>{
    for (const logData of logDatas) {
      const logAddress = logData.address === thisAddress ? '' : ` from ${prettyAddress(logData.address, deployment)}`
      if (deployment.addresses[logData.address]) {
        const eventContractInterface = await interfaces[deployment.contracts[deployment.addresses[logData.address]].type]
        if (eventContractInterface) {
          const eventData = eventContractInterface.parseLog(logData)
          if (eventData) {
            log.result(`event ${eventData.name}${prettyValues(eventData.args.slice(), eventData.eventFragment.inputs, deployment)}${logAddress}`)
            continue
          }
        }
      }
      log.result(`unknown event [${logData.topics.join(', ')}] (${logData.data})${logAddress}`)
    }

  },
  gaslog:async(tx, rcpt, label)=>{
    let readLog=[],rv={};
    let logPath = path.join(__dirname, `gaslog1.json`);
    fsX.ensureFileSync(logPath);
    readLog = fs.readFileSync(logPath, {encoding:'utf8'});
    readLog=/\S/m.test(readLog)?JSON.parse(readLog):[];
    rv.name = label;
    if(tx.gasPrice!==gVals.gasPrice){rv.gasPrice = tx.gasPrice.toString();}
    if(tx.gasLimit!==gVals.gasLimit){rv.gasLimit = tx.gasLimit.toString();}
    // try{rv.maxPriorityFeePerGas = tx.maxPriorityFeePerGas.toString();}catch(e){}
    // try{rv.maxFeePerGas = tx.maxFeePerGas.toString();}catch(e){}
    //gasUsed: The amount of gas actually used by this transaction
    try{rv.gasUsed = rcpt.gasUsed.toString();}catch(e){}
    //cumulative up to that point in the block ... includes other tx before this tx
    // try{rv.cumulativeGasUsed = rcpt.cumulativeGasUsed.toString();}catch(e){}
    // try{rv.effectiveGasPrice = rcpt.effectiveGasPrice.toString();}catch(e){}
    readLog.push(rv)
    fsX.writeJsonSync(logPath, readLog, {spaces:2});
    __(`wrote to ${logPath}`);
  },
  wait:async(tx, label, report=false, confirmation=1)=>{
    if(hre.config.defaultNetwork!=='hardhat'){confirmation=3}
    return new Promise((resolve,reject)=> {
      if(label && rc.network==='hardhat'){console.log(`> Awaiting "${label}" tx`);}
      else if(label){console.log(`> Awaiting "${label}" tx: ${tx.hash}`);}
      else if(rc.network==='hardhat'){console.log(`> Awaiting tx`);}
      else{console.log(`> Awaiting tx: ${tx.hash}`);}
      ethers.provider.waitForTransaction(tx.hash, confirmation)
      .then((rcpt)=>{
        if(report){__(`receipt: `, formatRcpt(rcpt,label));}
        setTimeout(()=>{resolve(rcpt)},300);})
      .catch((err)=>{__(`tx err: `, err);setTimeout(()=>{reject(err)},500);});
    })
  },

}

/**
 * @typedef OutputTxRcpt
 * @property {array} output contract method return, if applicable
 * @property {object} tx transaction object
 * @property {object} rcpt reciept object
 */
/**
 * Handle any smart contract method
 *
 * @async
 * @function TX
 * @param {string} _signature - inst label and method name
 * @param {object} [_user] - optional user to connect, omit for accounts[0]._signer
 * @param {array} [_args] - args to pass to solidity function
 * @param {string?} [_msg] - optional extra labelling if desired
 * @param {number?} [_logLevel] - optional log level 0 through 2, 0 is silent
 * @return {Promise<OutputTxRcpt>}
 * @notice may only be run after initEnv
 */
