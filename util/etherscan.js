const axios = require('axios');
const * as constants = require('../.constants.js');

const { ETHERSCAN_API_KEY,
  ADDRESS_ROUTER, ADDRESS_OWNER, ADDRESS_FROGEX, ADDRESS_PAIR,
  ADDRESS_FXSWAP, ADDRESS_CHARITY_BENEF, ADDRESS_MARKETING_BENEF,
} = constants

const urlBalanceOf = address =>
  `https://api.etherscan.io/api?module=account
  &action=tokenbalance&contractaddress=${ADDRESS_FROGEX}
  &address=${address}
  &tag=latest&apikey=${ETHERSCAN_API_KEY}`
const urlConfTimeEstimate =
  `https://api.etherscan.io/api
   ?module=gastracker
   &action=gasestimate
   &gasprice=2000000000
   &apikey=${ETHERSCAN_API_KEY}`
const urlGasOracle = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`
const urlLatestEthPrice = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETHERSCAN_API_KEY}`
const urlLatestEthPriceCoinstat = `https://api.coinstats.app/public/v1/coins/ethereum?currency=USD`
const devMode = true;
exports.handler = async (event, _, callback) => {
  const { method } = event.queryStringParameters
  if(!method){
    return { statusCode: 400, body: 'Method Required Eg. ?module=stats' }
  }
  if(devMode){
    return { statusCode: 200, body: '3420.69' }
  }
  const url = {
    ethPrice:urlLatestEthPriceCoinstat, estConfirmTime:urlConfTimeEstimate, gasOracle:urlGasOracle,
  }[method]

  let response;
  try {
    response = await axios.get(url);
    console.log(method,response.data.result.ethusd);
    response = response.data.result.ethusd;
  } catch (error) {
    response = error;
    console.error(method,error);
  }
  return { statusCode: 200, body: response }
}
