import axios from 'axios';

export async function checkUserTx(userId, serviceAddress): Promise<boolean> {
  let ok: boolean = false;
  let blockNumberResult = `https://api.polygonscan.com/api?module=proxy&action=eth_blockNumber&apikey=${process.env.POLYGON_SCAN_API_KEY}`;
  let url = `https://api.polygonscan.com/api?module=account&action=txlist&address=${userId}&startblock=0&endblock=9999999999999999999999&page=1&offset=100&sort=asc&apikey=${process.env.POLYGON_SCAN_API_KEY}`;
  let result = await axios.get(url);
  if (result.data.message == 'OK') {
    let data = result.data['result'];
    for (let index = 0; index < data.length; index++) {
      console.log('data ', data[index]);
    }
  }

  return ok;
}
