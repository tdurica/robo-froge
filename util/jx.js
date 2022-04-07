const [__,__E,__W]=[console.log,console.error,console.warn];
const fs = require("fs");
const path = require("path");
const fsX = require("fs-extra");
const glob = require("glob");
const {dp} = require("./deep");
const _ = require("lodash");
const {sChg} = require("./mathUtils");
const jx = {
  src:(srcPath)=>require(srcPath),
  _destwip:[],
  destPath: '', //'./jx1.json',
  destPathAbs:'',
  dest:{
    loadPath:(destPath)=>{
      if(!destPath){
        if(jx.dest.glob().length){jx.dest.assurePath(jx.dest.latestPath())
        }else{jx.dest.assurePath(jx.dest.nextNewPath())}
      }else{jx.dest.assurePath(destPath)}
      jx._destwip= fs.readFileSync(jx.destPathAbs, {encoding:'utf8'});
      jx._destwip=/\S/m.test(jx._destwip)?JSON.parse(jx._destwip):[];
    },
    assurePath:(fp)=>{
      if(fp==='new'||!fp&&!jx.destPath){fp=jx.dest.nextNewPath();}
      else if(!fp&&jx.destPath){fp=jx.destPath}
      else if(!fp&&jx.destPathAbs){fp=jx.destPathAbs}
      if(/^\w:/.test(fp)){jx.destPathAbs=fp;
        jx.destPath=fp.match(/(jx\d+.json)$/g)[0]}
      else if(/^\.\//.test(fp)){jx.destPath=fp;
        jx.destPathAbs=path.join(require.main.path, fp)}
      else if(/^[^:\\\/]*$/.test(fp)){//fname, no path
        jx.destPath='./'+fp;
        jx.destPathAbs=path.join(require.main.path, jx.destPath);}
      fsX.ensureFileSync(jx.destPathAbs);
    },
    glob:()=>glob.sync(path.join(require.main.path, "**/jx*.json")),
    nextNewPath:()=>path.join(require.main.path, `./jx${jx.dest.glob().length+1}.json`),
    latestPath:()=>path.join(require.main.path, `./jx${jx.dest.glob().length}.json`),
    new:()=>{jx.dest.assurePath('new');return jx.dest.write;},
    write:(destPath)=>{
      jx.dest.assurePath(destPath)
      if(!jx._destwip.length)jx.dest.loadPath(destPath)
      jx.pushEachPropToNewIdx()
      fsX.writeJsonSync(jx.destPathAbs, jx._destwip, {spaces:2});
      __(`wrote to ${jx.destPathAbs}`);
    },
    writeNew:(obj,path)=>{jx.stage=obj;jx.dest.new().write(path);},
  },
  stage: {},
  add:(k,v)=>{jx.stage[k]=v;},
  push:(val)=>{jx.stage.push(val)},
  // jx.stage={redCar:32};
  // jx.new().write('carsLog.json')
  // jx.writeNew(myObj)
  spreadToBase:(input)=>{jx._destwip.push(...input)},           /* [{}, ...vals ]   */
  spreadToSingleNewIdx:(input)=>{jx._destwip.push({...input})}, /* [{},{ ...props }]*/
  spreadToSingleNewIdxWithName:(input, label)=>{
    jx._destwip.push(label?
      {name:`i${jx._destwip.length+1}`,...input} //[{},{name:'label', ...props }]
      :{name:`${label}`,...input}) //[{},{name:'i2', ...props }]
  },
  pushEachPropToNewIdx:()=>{
    //[{},{ i2-myKey: '' },{ i3-myKey: {...} }, ... ]
    for(let [k,v] of Object.entries(jx.stage)){
      jx._destwip.push({[`i${jx._destwip.length+1}-${k}`]:v});
    }
  },
  usageExamples(obj,maxDepth=8,keepNums=false){
    let sel = dp.select(src,(obj)=>{ return typeof obj == 'number' } );
    let res1 = dp.xform(src,(vvv)=>{
      if(vvv._isBigNumber&&vvv._hex)return vvv.toString()
      if(typeof(vvv)==='number')return vvv.toString()
      if(vvv==='yooo')return 'sup'
    })

    // jx.dest.write()

    let src = jx.src('./caB5.json')
    let rv = src.push('heyoo')
    jx.dest.writeNew(rv)

    src.forEach((v)=>{
      if(typeof(v)==='string'){fxPriceChange.push(v)}
      if(v.sell_1Fx_fees){
        fxPriceChange.push(v.sell_1Fx_fees.hrexpectedUSD)
      }
    })
    jx.dest.write()

  },

}
module.exports =  jx;
