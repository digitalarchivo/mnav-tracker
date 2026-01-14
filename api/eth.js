import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const r = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const data = await r.json();
    res.status(200).json({ ethPrice: data.ethereum.usd });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch ETH price' });
  }
}
