import { useEffect, useState } from 'react';
import './globals.css';

export default function Page() {
  const [ethPrice, setEthPrice] = useState(null);
  const [strategies, setStrategies] = useState([]);
  const [btc, setBtc] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // ETH price
    const ethData = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      .then(res => res.json());
    setEthPrice(ethData.ethereum.usd);

    // Strategies
    const strategyData = await fetch('/api/strategies').then(res => res.json());
    setStrategies(strategyData);

    // BTC treasury
    const btcData = await fetch('/api/btc').then(res => res.json());
    setBtc(btcData);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Strategy Token mNAV Tracker</h1>
      <p>Live ETH Price: {ethPrice ? `$${ethPrice}` : 'Loading...'}</p>

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
          {strategies.length === 0 ? <tr><td colSpan="4">Loading...</td></tr> :
            strategies.map(s => (
              <tr key={s.name}>
                <td>{s.name}</td>
                <td>{s.holders}</td>
                <td>{s.floor ? s.floor + ' Ξ' : 'N/A'}</td>
                <td>{s.floor && ethPrice ? `$${(s.floor * ethPrice * s.holders).toFixed(0)}` : 'N/A'}</td>
              </tr>
            ))
          }
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
          {btc.length === 0 ? <tr><td colSpan="4">Loading BTC data…</td></tr> :
            btc.map(c => (
              <tr key={c.name}>
                <td>{c.name}</td>
                <td>{c.btcHoldings}</td>
                <td>${c.btcPrice}</td>
                <td>${c.btcValue.toLocaleString()}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}
