
const isPlainObject = (obj) => {
  if ((obj != null ? obj.constructor : void 0) == null) {
    return false;
  }
  return obj.constructor.name === 'Object';
};

const deepForEach = (obj,userFn,maxDepth=10) => {
  let rc = (vv, dep)=>{const currDep=dep+1;
    if (currDep>maxDepth+1)return vv
    if (Array.isArray(vv)) {
      if(!vv.length){return vv;}let nArr=[];
      for(let [k,v] of Object.entries(vv)){
        if(/\D/.test(k)){//recurses array and ola
          nArr[k]=rc(v,currDep);
        }else{
          nArr.push(rc(v,currDep));
        }
      } vv=nArr;
    }else if(isPlainObject(vv)){
      Object.keys(vv).forEach(function (k) {
        vv[k] = rc(vv[k],currDep);//object recurse
      })
    }
    return userFn(vv);
  };
  return rc(obj,0);
}

const olaToObject = (objLikeArray, allToStr=true )=>{
  let nObj={},ola=objLikeArray;
  if(Array.isArray(ola)){
    for(let [k,v] of Object.entries(ola)){
      if(/\D/.test(k)){nObj[k]=allToStr?v.toString():v}
    }
  }else{
    return objLikeArray;
  }
  return nObj;
}

const allBNToStr = (obj,maxDepth=8,keepNums=false) => {
  let rc = (vv, dep)=>{const currDep=dep+1;
    if (vv==null){return vv;}
    if(vv._isBigNumber&&vv._hex){return vv.toString();}
    if(typeof(vv)==='number'&&!keepNums){return vv.toString();}
    if (currDep>maxDepth){return vv;}
    if (Array.isArray(vv)) {
      if(!vv.length){return vv;}let nArr=[];
      for(let [k,v] of Object.entries(vv)){
        if(/\D/.test(k)){nArr[k]=rc(v,currDep);
        }else{nArr.push(rc(v,currDep));}
      }vv=nArr;
    }else if(typeof(vv)==='object'){
      Object.keys(vv).forEach(function (k) {
        vv[k] = rc(vv[k],currDep);})}return vv;
  };return rc(obj,0);
}

const ____usageExamples = (obj,maxDepth=8,keepNums=false) => {
  let sel = dp.select(log1,(obj)=>{ return typeof obj == 'number' } );

  let res1 = dp.xform(log1,(vvv)=>{
    if(vvv._isBigNumber&&vvv._hex)return vvv.toString()
    if(typeof(vvv)==='number')return vvv.toString()
    if(vvv==='yooo')return 'sup'
  })
}


module.exports = {isPlainObject, deepForEach, olaToObject, allBNToStr}



