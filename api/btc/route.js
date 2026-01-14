export async function GET() {
  const btcPrice = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    .then(res => res.json())
    .then(data => data.bitcoin.usd);

  const companies = [
    { name: 'MicroStrategy', btcHoldings: 687410 }
  ];

  const result = companies.map(c => ({
    ...c,
    btcPrice,
    btcValue: c.btcHoldings * btcPrice
  }));

  return new Response(JSON.stringify(result), { status: 200 });
}
