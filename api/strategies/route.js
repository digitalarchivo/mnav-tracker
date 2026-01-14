export async function GET() {
  const STRATEGIES = [
    { name: 'PunkStrategy', coingeckoId: 'cryptopunks' },
    { name: 'ApeStrategy', coingeckoId: 'bored-ape-yacht-club' },
    { name: 'PudgyStrategy', coingeckoId: 'pudgy-penguins' },
    { name: 'VibeStrategy', coingeckoId: 'good-vibes-club' },
    { name: 'ChimpStrategy', coingeckoId: 'chimpers-nft' },
    { name: 'MeebitStrategy', coingeckoId: 'meebits' },
    { name: 'AzukiStrategy', coingeckoId: 'azuki' },
    { name: 'MoonbirdsStrategy', coingeckoId: 'moonbirds' }
  ];

  // Fetch floor prices
  const results = await Promise.all(
    STRATEGIES.map(async (s) => {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/nfts/${s.coingeckoId}`);
        const data = await res.json();
        const floor = data.floor_price?.native_currency || null;
        const holders = data.number_of_unique_addresses_holding || 10;
        return { ...s, floor, holders };
      } catch {
        return { ...s, floor: null, holders: 10 };
      }
    })
  );

  return new Response(JSON.stringify(results), { status: 200 });
}
