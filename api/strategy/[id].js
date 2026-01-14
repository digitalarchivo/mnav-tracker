import fetch from 'node-fetch';

const STRATEGIES = {
  punkstrategy: { tokenId: 'punkstrategy', nftId: 'cryptopunks', holdings: 37 },
  apestrategy: { tokenId: 'apestrategy', nftId: 'bored-ape-yacht-club', holdings: 12 },
  pudgystrategy: { tokenId: 'pudgystrategy', nftId: 'pudgy-penguins', holdings: 15 },
  vibestrategy: { tokenId: 'vibestrategy', nftId: 'good-vibes-club', holdings: 18 },
  chimpstrategy: { tokenId: 'chimpstrategy', nftId: 'chimpers-nft', holdings: 22 },
  meebitstrategy: { tokenId: 'meebitstrategy', nftId: 'meebits', holdings: 10 },
  azukistrategy: { tokenId: null, nftId: 'azuki', holdings: 8 },
  moonbirdsstrategy: { tokenId: null, nftId: 'moonbirds', holdings: 5 },
};

export default async function handler(req, res) {
  const { id } = req.query;
  const strat = STRATEGIES[id];
  if (!strat) return res.status(404).json({ error: 'Strategy not found' });

  try {
    // Token FDV
    let fdv = null;
    if (strat.tokenId) {
      try {
        const r1 = await fetch(
          `https://api.coingecko.com/api/v3/coins/${strat.tokenId}`
        );
        const data1 = await r1.json();
        fdv =
          data1.market_data?.fully_diluted_valuation?.usd ||
          data1.market_data?.market_cap?.usd ||
          null;
      } catch (e) {
        console.warn(`Failed to fetch FDV for ${id}`);
      }
    }

    // NFT floor
    let floorEth = null;
    if (strat.nftId) {
      try {
        const r2 = await fetch(
          `https://api.coingecko.com/api/v3/nfts/${strat.nftId}`
        );
        const data2 = await r2.json();
        floorEth = data2.floor_price?.native_currency || null;
      } catch (e) {
        console.warn(`Failed to fetch NFT floor for ${id}`);
      }
    }

    res.status(200).json({
      name: id,
      holdings: strat.holdings,
      fdv,
      floorEth,
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch strategy data' });
  }
}
