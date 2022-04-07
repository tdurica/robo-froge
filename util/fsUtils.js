const hre = require("hardhat");
const rc = require.main.runcommands;
// const {ethers} = hre;
const fs  = require("fs");
const fsX  = require("fs-extra");
const csv  = require("csv-parser");
const {spawnSync}  = require("child_process");
const {last4}  = require("./zmath.js");
const path  = require("path");
const PROJECTROOT = hre.config.paths.root;
const __ = console.log;
const glob  = require("glob");

function appendToLog(newobj){
  const fpath = path.join(__dirname,'../_log_deploys.json');
  const log = fsX.readJsonSync(fpath);
  log.push({_time: new Date().toLocaleString(), ...newobj});
  fsX.writeJsonSync(fpath, log, {spaces:2});
  __('...appended to _log_deploys.json')
}
function getJSONfromCSV(path,results=[]){
  return new Promise((resolve,reject)=>{
    fs.createReadStream(path)
    .pipe(csv()).on('data', (data) => results.push(data))
    .on('end', () => {resolve(results)});
  })
}
function setActive(key,value){
  // const req = require.main.children[0].path;
  const fpath = path.join(__dirname,'../_active.json');
  const activeLog = fsX.readJsonSync(fpath);
  activeLog[key] = value;
  fsX.writeJsonSync(fpath, activeLog, {spaces:2});
  __('...wrote to _active.json')
}
function getActive(key){
  const fpath = path.join(__dirname,'../_active.json');
  const activeLog = fsX.readJsonSync(fpath);
  if(activeLog[key]==null){
    __(`_active.json: key not found!`);return null;}
  return activeLog[key];
}

function ssLogAppend(evtLabel, snap){let readLog;
  let sslDirPath = path.join(__dirname,'../../ssLogs')
  let logPath = path.join(sslDirPath, `${last4(getActive('flowx'))}.json`);
  fsX.ensureFileSync(logPath);
  readLog = fs.readFileSync(logPath, {encoding:'utf8'});
  readLog=/\S/m.test(readLog)?JSON.parse(readLog):[];
  if(readLog.length&&readLog.some(v=>/__end__/.test(v.name)))readLog=[];
  if(readLog.length>parseInt(evtLabel.match(/^\d+/)[0]||0))readLog=[];
  let rv={name:`ss${readLog.length+1}-${evtLabel}`,...snap}
  readLog.push(rv);
  // if(changeObj)rv.change=changeObj
  // if(ratesObj)rv.rates=ratesObj
  fsX.writeJsonSync(logPath, readLog, {spaces:2});
  __(`wrote to ${logPath}`);
}

async function etherscanVerify({deployAddr, deployArgs=[]}){
  await hre.run("verify:verify", {
    address: deployAddr,
    constructorArguments: deployArgs,
  });
}

export {
  fs,PROJECTROOT,appendToLog,getJSONfromCSV,ssLogAppend,
  etherscanVerify,setActive,getActive,
}
