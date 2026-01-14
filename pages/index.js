import { useEffect, useState } from 'react';

const STRATS = ['punkstrategy', 'apestrategy', 'pudgystrategy'];

export default function Home() {
  const [ethPrice, setEthPrice] = useState(0);
  const [btc, setBtc] = useState(null);
  const [strategyData, setStrategyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const ethRes = await fetch('/api/eth');
      const ethJson = await ethRes.json();
      setEthPrice(ethJson.ethPrice);

      const btcRes = await fetch('/api/btc');
      const btcJson = await btcRes.json();
      setBtc(btcJson);

      const stratData = await Promise.all(
        STRATS.map(async (id) => {
          const res = await fetch(`/api/strategy/${id}`);
          return await res.json();
        })
      );
      setStrategyData(stratData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 300000); // refresh 5 min
    return () => clearInterval(interval);
  }, []);

  const format = (num) =>
    num ? '$' + Math.round(num).toLocaleString() : '—';

  const formatMnav = (fdv, nftValue) =>
    fdv && nftValue ? (fdv / nftValue).toFixed(2) + 'x' : '—';

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Strategy Token mNAV Tracker</h1>
      <p>Live ETH Price: {ethPrice ? format(ethPrice) : 'Loading...'}</p>

      <h2>Strategies</h2>
      {loading ? (
        <p>Loading strategy data...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Strategy</th>
              <th>Holdings</th>
              <th>Floor (ETH)</th>
              <th>NFT Value (USD)</th>
              <th>FDV (USD)</th>
              <th>mNAV</th>
            </tr>
          </thead>
          <tbody>
            {strategyData.map((s) => {
              const nftValue = s.floorEth && s.holdings ? s.floorEth * ethPrice * s.holdings : null;
              return (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td>{s.holdings}</td>
                  <td>{s.floorEth?.toFixed(2) || '—'}</td>
                  <td>{format(nftValue)}</td>
                  <td>{format(s.fdv)}</td>
                  <td>{formatMnav(s.fdv, nftValue)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <h2>BTC Treasury</h2>
      {btc ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>BTC Holdings</th>
              <th>BTC Price</th>
              <th>Value (USD)</th>
              <th>FDV</th>
              <th>mNAV</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{btc.btcHoldings.toLocaleString()}</td>
              <td>{format(btc.btcPrice)}</td>
              <td>{format(btc.btcValue)}</td>
              <td>{format(btc.marketCap)}</td>
              <td>{btc.mnav.toFixed(2)}x</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading BTC data…</p>
      )}
    </div>
  );
}
