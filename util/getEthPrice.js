const axios = require('axios');
const ETHERSCAN_API_KEY="514SSMF6P7BM1546Z3WBEJR147TT6AJ9IS"

const urlLatestEthPrice = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETHERSCAN_API_KEY}`
const urlLatestEthPriceCoinstat = `https://api.coinstats.app/public/v1/coins/ethereum?currency=USD`
const devMode = 0;
async function getEthPrice () {
  let response;
  if(devMode){
    return '3420.69'
  }
  try {
    response = await axios.get(urlLatestEthPriceCoinstat);
    console.log('ethPrice rv: ',response.data.coin.price);
    response = response.data.coin.price;
  } catch (error) {
    response = error;
    console.error(error);
  }
  return response
}
module.exports = { getEthPrice };
