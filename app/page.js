'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [strategies, setStrategies] = useState([]);
  const [btcData, setBtcData] = useState([]);
  const [ethPrice, setEthPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch('/api/strategies');
        const data = await res.json();
        setStrategies(data.strategies);
        setEthPrice(data.ethPrice);

        const btcRes = await fetch('/api/btc');
        const btc = await btcRes.json();
        setBtcData(btc.companies);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function formatCurrency(value) {
    if (!value) return '—';
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
    if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
    return value.toLocaleString();
  }

  function formatEth(value) {
    if (!value) return '—';
    return value.toFixed(2) + ' Ξ';
  }

  function formatMnav(value) {
    if (!value) return '—';
    return value.toFixed(2) + 'x';
  }

  function getSignal(mnav) {
    if (!mnav) return '—';
    if (mnav < 1) return 'Buy';
    if (mnav > 5) return 'Sell';
    return 'Hold';
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20, fontFamily: 'DM Sans, sans-serif' }}>
      <h1>Strategy Token mNAV Tracker</h1>
      <h3>ETH Price: ${ethPrice}</h3>

      <table border="1" cellPadding="5" style={{ width: '100%', marginTop: 20 }}>
        <thead>
          <tr>
            <th>Strategy</th>
            <th>Holdings</th>
            <th>Floor Price</th>
            <th>Market Value</th>
            <th>FD Market Cap</th>
            <th>mNAV</th>
            <th>Signal</th>
          </tr>
        </thead>
        <tbody>
          {strategies.map(s => (
            <tr key={s.id}>
              <td>{s.name} ({s.tokenSymbol})</td>
              <td>{s.holdings}</td>
              <td>{formatEth(s.floorPriceEth)}</td>
              <td>{formatCurrency(s.marketValueNfts)}</td>
              <td>{formatCurrency(s.marketCap)}</td>
              <td>{formatMnav(s.mNav)}</td>
              <td>{getSignal(s.mNav)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 40 }}>BTC Treasury Companies</h2>
      <table border="1" cellPadding="5" style={{ width: '100%', marginTop: 10 }}>
        <thead>
          <tr>
            <th>Company</th>
            <th>BTC Holdings</th>
            <th>BTC Price</th>
            <th>BTC Value</th>
            <th>FD Market Cap</th>
            <th>mNAV</th>
          </tr>
        </thead>
        <tbody>
          {btcData.map(c => (
            <tr key={c.id}>
              <td>{c.name} ({c.ticker})</td>
              <td>{c.btcHoldings}</td>
              <td>{c.btcPrice}</td>
              <td>{formatCurrency(c.btcValue)}</td>
              <td>{formatCurrency(c.marketCap)}</td>
              <td>{formatMnav(c.mNav)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
