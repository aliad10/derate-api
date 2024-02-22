import axios from 'axios';

export async function checkUserTx(
  userAddress: string,
  serviceAddress: string,
  limit: number
): Promise<boolean> {
  let ok: boolean = false;

  let blockNumberUrl = `https://api-mumbai.polygonscan.com/api?module=proxy&action=eth_blockNumber&apikey=${process.env.POLYGON_SCAN_API_KEY}`;

  const blockNumberResult = await axios.get(blockNumberUrl);

  if (blockNumberResult.data) {
    let url = `https://api-mumbai.polygonscan.com/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=${Number(
      blockNumberResult.data['result']
    )}&page=1&offset=${limit}&sort=asc&apikey=${
      process.env.POLYGON_SCAN_API_KEY
    }`;

    let result = await axios.get(url);

    if (result.data.message == 'OK') {
      let data = result.data['result'];

      for (let index = 0; index < data.length; index++) {
        if (data[index]['to'].toLowerCase() == serviceAddress.toLowerCase()) {
          ok = true;
          break;
        }
      }
    }
  }

  return ok;
}
