import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const r = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    );
    const data = await r.json();

    // Example: MicroStrategy BTC treasury
    const btcHoldings = 687410;
    const btcPrice = data.bitcoin.usd;
    const btcValue = btcHoldings * btcPrice;
    const marketCap = 80000000000; // example FDV
    const mnav = marketCap / btcValue;

    res.status(200).json({ btcPrice, btcHoldings, btcValue, marketCap, mnav });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch BTC price' });
  }
}
