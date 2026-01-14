export const BTC_TREASURY_COMPANIES = [
  { id: 'strategy-mstr', name: 'MicroStrategy', ticker: 'MSTR', btcHoldings: 687410 }
];

export async function GET() {
  try {
    const btcRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const btcData = await btcRes.json();
    const btcPrice = btcData.bitcoin.usd;

    const results = BTC_TREASURY_COMPANIES.map(c => {
      const btcValue = c.btcHoldings * btcPrice;
      const marketCap = 80000000000; // estimated
      const mNav = marketCap / btcValue;
      return { ...c, btcPrice, btcValue, marketCap, mNav };
    });

    return new Response(JSON.stringify({ btcPrice, companies: results }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
