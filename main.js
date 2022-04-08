const {
  _Add, _Div, _Mul, weiToUSD, _toBN, sRnd
} = require('./util/zmath.js');
const { readFXP,useCrawlStore } = require('./util/services.js');

const TelegramBot = require("node-telegram-bot-api");
const addr  = require('./util/addresses.js');
const htmlToImage  = require('./puppet/htmlToImage.js');
const hre  = require("hardhat");
const {ethers,web3} = hre;
const { sup }  = require('./puppet/partials.js');
const { sExp, last4 }  = require('./util/zmath.js');
const fs = require('fs');
const APIKEY = '5162984001:AAGrfqHU0D6zbK_87Tu7w4M3DLCJDUY2J9E'
const bot = new TelegramBot(APIKEY,{polling:true})
//https://core.telegram.org/bots/api
//name: RoboFroge    username: t.me/robofroge_bot
//name: robofrogeland https://t.me/+pOeLhMj1Tk1lYWNh
//channel ID: forward a message from a channel to @JsonDumpBot bot
//channel: moonco id: 1659226728  froge main: 1478574201
async function main() {
  await hre.run('compile');
  // const imageBuffer = await htmlToImage('045', 14, 'BD93','FROGEX SELL!','4023.68');
  // await bot.sendPhoto('1659226728', imageBuffer)
  // await bot.sendMessage('1659226728',`TRANSFER DETECTED OMGGGG`)
  let info = [];
  await i.init_fx8700();
  await i.init_fxPair();
  // i.fx8700.on("Transfer", async (from, to, value) => {
  await mockTransfer( '0xf2a40df9B694B072E38Dd678549E3fd7AFbB00BA',
    '0x659fBdCEE024A576354799EE42EF1639E62947B0',_toBN('1000111000333222111'))
  async function mockTransfer (from, to, value){
    const amount = value.toString()
    const rsvs = i.fxPair.callStatic.getReserves()
    const ethPrice = await useCrawlStore.getState().fetch_ethPrice()
    const valueUSD = sRnd(await FXP.getFxPrice(ethPrice, amount),-2)
    console.log(from, to, amount);
    let action = 0
    if(from.toLowerCase() === addr.mainnet.FROGEX.ERC20.toLowerCase()
      ||to.toLowerCase() === addr.mainnet.FROGEX.ERC20.toLowerCase()){
      return;
    }
    else if(from.toLowerCase() === addr.mainnet.FROGEX.PAIR.toLowerCase()){//BUY
      action = 0
    }
    else if(to.toLowerCase() === addr.mainnet.FROGEX.PAIR.toLowerCase()){//SELL
      action = 1
    }
    /* else{return;} *///UNINTERESTING
    let actionLabel = action<1?'FROGEX BUY!':'FROGEX SELL!'
    const hrVal = sExp(amount,-9)
    const hrFrom = last4(from)
    const hrTo = last4(to)
    const user4 = /* action<1?hrTo:hrFrom; */
      'So, tell me about your life.  What\'s going on with the *real* Jacob?'
    const numFroges = (sRnd(hrVal)).length;
    const imageBuffer = await htmlToImage('018', numFroges,user4,actionLabel,valueUSD);
    fs.writeFileSync("./image.png", imageBuffer);

    const fileOptions = {
      // filename: 'customfilename',
      contentType: 'image/jpeg',//image/jpeg | image/png | image/svg+xml
    };
    await bot.sendPhoto('-1001478574201', imageBuffer,fileOptions)
  }

  // });
  bot.on('message',async (message)=>{
    // console.log(message)
    console.log(message.text)
    console.log(message.from.id)
    const chat_id = message.from.id
    if(chat_id.toString() === '1901639690'){
      // await bot.sendMessage('-1001478574201', 'Listen')
    }
    // const imageBuffer = await htmlToImage(sup());
    // await bot.sendPhoto('-1001478574201', 'You talkin to me??? RoboFroge speaks to no one.')
  })
  if(0/* test 1 -*/){

  }
}

async function digits(digitSeed){
  
}

/*
* Spent: 0.125 ETH ($419.58)
Got: 63,058,409 FROGEX
Buyer Position: (https://etherscan.io/address/0x0eAc77592c0D70e48c965112094815a57BdD1659) 🆕 New!
DEX: UniSwap
Price: 0.000000001982 ETH ($0.000006654)
MarketCap: $2,745,315
TX (https://etherscan.io/tx/0xdff07ce0ae9a11c3617f25af9b92815bb358f68235814726bc0b20d01d75909b)
* | Buy (https://app.uniswap.org/#/swap?inputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&outputCurrency=0x5fa54fddf1870c344dbfabb37dfab8700ec0def1)
* | Chart (https://www.dextools.io/app/ether/pair-explorer/0x5119155c5644c31c94f2fbaf0ccc79c4f92fb686)*/
let i = {
  init_fx8700:async ()=>await i._iFromContractAt('fx8700','FrogeX',addr.mainnet.FROGEX.ERC20,),
  init_fxPair:async ()=>await i._iFromContractAt('fxPair','IUniV2Pair',addr.mainnet.FROGEX.PAIR,),
  _iFromContractAt:async (label,FqLabelOrABI,atAddr)=>{
    i[label] = await ethers.getContractAt(FqLabelOrABI, atAddr);
    await i[label].deployed();addr[label]=i[label].address;
    return i[label];
  },
}

main()
.catch((error)=>{console.error(error);process.exit(1);})


const FXP = {
  balanceOf:async()=>readFXP('UniswapV2Pair', []),
  token0:async()=>readFXP('token0', []),//FROGEX
  token1:async()=>readFXP('token1', []),//WETH
  getReserves:async()=> {
    // const rsvFX = await FX.balanceOf(addr.mainnet.FROGEX.PAIR)
    // const rsvWETH = await WETH.balanceOf(addr.mainnet.FROGEX.PAIR)
    const gRsvs = await readFXP('getReserves', [])
    // console.log(gRsvs)
    const { reserve0,reserve1 } = gRsvs;
    return [reserve0,reserve1] //TODO: unburden multicall
  },
  getAmountOut:async(amountIn,nTokenIn)=> {
    //nTokenIn: 0 is frogex in (for sells), 1 is eth in (for buys)
    const [fx1,weth1] = await FXP.getReserves()
    const [reserveIn,reserveOut] = nTokenIn?[weth1,fx1]:[fx1,weth1]
    let amountInWithFee = _Mul(amountIn,997);
    let numerator = _Mul(amountInWithFee,reserveOut);
    let denominator = _Add(_Mul(reserveIn,1000),amountInWithFee);
    let amountOut = _Div(numerator, denominator);
    return amountOut;
  },
  getFxPrice:async(ethPrice, fxIn='1000000000')=> {
    let weiOut = await FXP.getAmountOut(fxIn,0);
    return weiToUSD(weiOut,ethPrice);
  },
}
