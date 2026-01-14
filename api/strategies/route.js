// app/api/strategies/route.js
export const STRATEGIES = [
  { id: 'punkstrategy', name: 'PunkStrategy', tokenSymbol: 'PNKSTR', coingeckoTokenId: 'punkstrategy', coingeckoNftId: 'cryptopunks' },
  { id: 'apestrategy', name: 'ApeStrategy', tokenSymbol: 'APESTR', coingeckoTokenId: 'apestrategy', coingeckoNftId: 'bored-ape-yacht-club' },
  { id: 'pudgystrategy', name: 'PudgyStrategy', tokenSymbol: 'PUDGYSTR', coingeckoTokenId: 'pudgystrategy', coingeckoNftId: 'pudgy-penguins' },
  { id: 'vibestrategy', name: 'VibeStrategy', tokenSymbol: 'VIBESTR', coingeckoTokenId: 'vibestrategy', coingeckoNftId: 'good-vibes-club' },
  { id: 'chimpstrategy', name: 'ChimpStrategy', tokenSymbol: 'CHMPSTR', coingeckoTokenId: 'chimpstrategy', coingeckoNftId: 'chimpers-nft' },
  { id: 'meebitstrategy', name: 'MeebitStrategy', tokenSymbol: 'MEEBSTR', coingeckoTokenId: 'meebitstrategy', coingeckoNftId: 'meebits' },
  { id: 'azukistrategy', name: 'AzukiStrategy', tokenSymbol: 'AZUKISTR', coingeckoTokenId: null, coingeckoNftId: 'azuki' },
  { id: 'moonbirdsstrategy', name: 'MoonbirdsStrategy', tokenSymbol: 'MOONSTR', coingeckoTokenId: null, coingeckoNftId: 'moonbirds' }
];

export async function GET() {
  try {
    const ethRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const ethData = await ethRes.json();
    const ethPrice = ethData.ethereum.usd;

    const results = await Promise.all(STRATEGIES.map(async s => {
      let marketCap = null, floorPriceEth = null, holdings = null;

      if (s.coingeckoTokenId) {
        try {
          const res = await fetch(`https://api.coingecko.com/api/v3/coins/${s.coingeckoTokenId}?localization=false&tickers=false&community_data=false&developer_data=false`);
          if (res.ok) {
            const data = await res.json();
            marketCap = data.market_data?.fully_diluted_valuation?.usd || data.market_data?.market_cap?.usd || null;
          }
        } catch {}
      }

      if (s.coingeckoNftId) {
        try {
          const res = await fetch(`https://api.coingecko.com/api/v3/nfts/${s.coingeckoNftId}`);
          if (res.ok) {
            const data = await res.json();
            floorPriceEth = data.floor_price?.native_currency || null;
            holdings = data.number_of_unique_addresses_holding || null;
          }
        } catch {}
      }

      if (!holdings) {
        const estimatedHoldings = {
          punkstrategy: 37,
          apestrategy: 12,
          pudgystrategy: 15,
          vibestrategy: 18,
          chimpstrategy: 22,
          meebitstrategy: 10,
          azukistrategy: 8,
          moonbirdsstrategy: 5
        };
        holdings = estimatedHoldings[s.id] || 10;
      }

      const floorPriceUsd = floorPriceEth ? floorPriceEth * ethPrice : null;
      const marketValueNfts = (holdings && floorPriceUsd) ? holdings * floorPriceUsd : null;
      const mNav = (marketCap && marketValueNfts && marketValueNfts > 0) ? marketCap / marketValueNfts : null;

      return { ...s, marketCap, holdings, floorPriceEth, floorPriceUsd, marketValueNfts, mNav };
    }));

    return new Response(JSON.stringify({ ethPrice, strategies: results }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
