import './globals.css';

// All NFT strategies
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

// BTC treasury
const BTC_COMPANIES = [
  { name: 'MicroStrategy', btcHoldings: 687410 }
];

// Server-side fetch helper
async function fetchEthPrice() {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
  const data = await res.json();
  return data.ethereum.usd;
}

async function fetchBtcPrice() {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
  const data = await res.json();
  return data.bitcoin.usd;
}

async function fetchStrategyData() {
  return Promise.all(
    STRATEGIES.map(async (s) => {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/nfts/${s.coingeckoId}`);
        const data = await res.json();
        const floor = data.floor_price?.native_currency || 0;
        const holders = data.number_of_unique_addresses_holding || 10;
        return { ...s, floor, holders };
      } catch {
        return { ...s, floor: 0, holders: 10 };
      }
    })
  );
}

export default async function Page() {
  const [ethPrice, btcPrice, strategies] = await Promise.all([
    fetchEthPrice(),
    fetchBtcPrice(),
    fetchStrategyData()
  ]);

  // Add BTC values
  const btcCompanies = BTC_COMPANIES.map(c => ({
    ...c,
    btcPrice,
    btcValue: c.btcHoldings * btcPrice
  }));

  return (
    <div style={{ padding: 20 }}>
      <h1>Strategy Token mNAV Tracker</h1>
      <p>Live ETH Price: ${ethPrice}</p>

      <h2>Strategies</h2>
      <table>
        <thead>
          <tr>
            <th>Strategy</th>
            <th>Holdings</th>
            <th>Floor (ETH)</th>
            <th>NFT Value (USD)</th>
          </tr>
        </thead>
        <tbody>
          {strategies.map(s => (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td>{s.holders}</td>
              <td>{s.floor} Ξ</td>
              <td>${(s.floor * ethPrice * s.holders).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>BTC Treasury</h2>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>BTC Holdings</th>
            <th>BTC Price (USD)</th>
            <th>BTC Value (USD)</th>
          </tr>
        </thead>
        <tbody>
          {btcCompanies.map(c => (
            <tr key={c.name}>
              <td>{c.name}</td>
              <td>{c.btcHoldings}</td>
              <td>${c.btcPrice}</td>
              <td>${c.btcValue.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
