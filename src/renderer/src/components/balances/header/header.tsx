import XeggexAPI from '@renderer/scripts/xeggexAPI';
import React, { useEffect, useState } from 'react';
import './header.css';
interface BalanceSummaryProps {
  balance: number;
  pendingBalance: number;
}

const BalanceHeader: React.FC<BalanceSummaryProps> = ({ balance, pendingBalance }) => {

  const [EVR_USDT, setEVR_USDT] = useState<any>(null);
  const [EVR_BTC, setEVR_BTC] = useState<any>(null);
  const [usdValue, setUsdValue] = useState<number>(0);
  const [btcValue, setBtcValue] = useState<number>(0);
  const xeggexAPI = new XeggexAPI();

  // Fetch the EVR_USDT and EVR_BTC tickers from the Xeggex API
  useEffect(() => {
    const fetchData = async () => {
      setEVR_USDT(await xeggexAPI.getTicker('EVR_USDT'));
      setEVR_BTC(await xeggexAPI.getTicker('EVR_BTC'));
    };
    fetchData();
  }, []);

  // Update the BTC and USD values when the EVR_USDT data is fetched
  useEffect(() => {
    if (EVR_USDT) {
      setUsdValue(EVR_USDT.last_price * balance);
    }
    if (EVR_BTC) {
      setBtcValue(EVR_BTC.last_price * balance);
    }
  }, [EVR_USDT, EVR_BTC]);
  
  //Formate the BTC value to 8 decimal places or scientific notation if the value is too small or too large
  const formattedBtcValue = ()=>{
    if (btcValue < 0.001) {
      return btcValue.toExponential(2);
    } else {
      return btcValue.toFixed(2);
    }
  }

  return (
    <div className="balance-summary">
      <div className="balance-item">
        <span className="balance-label">Available:</span>
        {balance} EVR
      </div>
      <div className="balance-item">
        <span className="balance-label">Pending:</span>
        {pendingBalance} EVR
      </div>
      <div className="balance-item">
        <span className="balance-label">USD Value:</span>
        {usdValue.toFixed(2)} USD
      </div>
      <div className="balance-item">
        <span className="balance-label">BTC Value:</span>
        {formattedBtcValue()} BTC
      </div>
    </div>
  );
};

export default BalanceHeader;