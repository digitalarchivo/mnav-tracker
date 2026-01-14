// app/page.js
'use client';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [ethPrice, setEthPrice] = useState(null);
  const [btcPrice, setBtcPrice] = useState(null);
  const [strategies, setStrategies] = useState([]);

  useEffect(() => {
    fetch('/api/btc')
      .then(res => res.json())
      .then(data => {
        setEthPrice(data.ethPrice);
        setBtcPrice(data.btcPrice);
      });

    fetch('/api/strategies')
      .then(res => res.json())
      .then(data => setStrategies(data));
  }, []);

  return (
    <main style={{ padding: '20px' }}>
      <h1>Strategy Token mNAV Tracker</h1>
      <p>Live ETH Price: {ethPrice ?? 'Loading...'}</p>
      <p>Live BTC Price: {btcPrice ?? 'Loading...'}</p>

      <h2>Strategies</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Strategy</th>
            <th>Token</th>
            <th>Holdings</th>
            <th>Floor (ETH)</th>
            <th>NFT Value (USD)</th>
          </tr>
        </thead>
        <tbody>
          {strategies.length === 0 ? (
            <tr><td colSpan="5">Loading strategies…</td></tr>
          ) : (
            strategies.map((s, i) => (
              <tr key={i}>
                <td>{s.name}</td>
                <td>{s.token}</td>
                <td>{s.holdings}</td>
                <td>{s.floorPriceEth}</td>
                <td>{s.floorPriceEth && s.holdings ? (s.floorPriceEth * s.holdings * ethPrice).toFixed(2) : '—'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
