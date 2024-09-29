import React, { useEffect, useState } from 'react';
import Sidebar from '@renderer/components/Sidebar';
import useWallet from '@renderer/hooks/UseWallet';
import './overview.css'; // Import the CSS file
import { getAddressAssetBalances } from '@renderer/scripts/manticoreAPI';
import BalanceHeader from '@renderer/components/balances/header/header.jsx';
import XeggexAPI from '@renderer/scripts/xeggexAPI';
import AssetTable from '@renderer/components/balances/table/table';
import TransactionTable from '@renderer/components/transactions/table/table';
import { saveFile, readFile, fileExists } from '@renderer/scripts/electronFS';
const Overview: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [pendingBalance, setPendingBalance] = useState<number>(0);

  const [transactions, setTransactions] = useState<any[]>([
    {
      id: '1',
      date: '2023-01-01',
      time: '12:00:00',
      amount: 100000000,
      status: 'Completed',
      assetName: 'Bitcoin',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    },
    {
      id: '2',
      date: '2023-01-02',
      time: '14:30:00',
      amount: 200000000,
      status: 'Pending',
      assetName: 'Ethereum',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    },
    {
      id: '3',
      date: '2023-01-03',
      time: '16:45:00',
      amount: 300000000,
      status: 'Failed',
      assetName: 'Litecoin',
      address: 'LcHKZ5z5J5J5J5J5J5J5J5J5J5J5J5J5J5'
    },
    {
      id: '4',
      date: '2023-01-04',
      time: '18:50:00',
      amount: 400000000,
      status: 'Completed',
      assetName: 'Bitcoin',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    },
    {
      id: '5',
      date: '2023-01-05',
      time: '20:55:00',
      amount: 500000000,
      status: 'Pending',
      assetName: 'Ethereum',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    },
    {
      id: '6',
      date: '2023-01-06',
      time: '22:50:00',
      amount: 600000000,
      status: 'Failed',
      assetName: 'Litecoin',
      address: 'LcHKZ5z5J5J5J5J5J5J5J5J5J5J5J5J5J5'
    },
    {
      id: '7',
      date: '2023-01-07',
      time: '00:55:00',
      amount: 700000000,
      status: 'Completed',
      assetName: 'Bitcoin',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    },
    {
      id: '8',
      date: '2023-01-08',
      time: '02:50:00',
      amount: 800000000,
      status: 'Pending',
      assetName: 'Ethereum',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    },
    {
      id: '9',
      date: '2023-01-09',
      time: '04:55:00',
      amount: 900000000,
      status: 'Failed',
      assetName: 'Litecoin',
      address: 'LcHKZ5z5J5J5J5J5J5J5J5J5J5J5J5J5J5'
    },
    {
      id: '10',
      date: '2023-01-10',
      time: '06:50:00',
      amount: 1000000000,
      status: 'Completed',
      assetName: 'Bitcoin',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    },
    {
      id: '11',
      date: '2023-01-11',
      time: '08:55:00',
      amount: 1100000000,
      status: 'Pending',
      assetName: 'Ethereum',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    },
    {
      id: '12',
      date: '2023-01-12',
      time: '10:50:00',
      amount: 1200000000,
      status: 'Failed',
      assetName: 'Litecoin',
      address: 'LcHKZ5z5J5J5J5J5J5J5J5J5J5J5J5J5J5'
    },
  ]);
  const [assets, setAssets] = useState<any[]>([]);
  const [btcValue, setBtcValue] = useState<number>(0); // New state for EVR balance
  const { getWallet } = useWallet();
  const [assetBalances, setAssetBalances] = useState<any[]>([]);

  useEffect(() => {
    const checkPendingBalance = async () => {
      const wallet = await getWallet();
      if (wallet) {
        await wallet.updatePendingBalance();
        setPendingBalance(wallet.pendingBalance / 100000000);
      }
    };
    
    const fetchData = async () => {
      const wallet = await getWallet();
      
      const assetsSaved = await fileExists("assets.json");
      if(assetsSaved){
        const assetsData = await readFile("assets.json");
        const assets_list = JSON.parse(assetsData);
        setAssets(assets_list);
      }else{
        const assetBalances = await getAddressAssetBalances(wallet.addresses.map(address => address.address));
        setAssets(assetBalances);
        saveFile("assets.json", JSON.stringify(assetBalances));
      }

      if (wallet) {
        await wallet.updateBalance();
        setBalance(wallet.balance.balance / 100000000);
        setPendingBalance(0 / 100000000);
        setBtcValue(0 / 100000000); // Assuming wallet.balance.evr contains the EVR balance

      }
    };
    fetchData();
  }, []);

  return (
      <div className="container">
        <BalanceHeader balance={balance} pendingBalance={pendingBalance} />
        <div className="tables-container">
        <div className="asset-table-container"> 
          <AssetTable assets={assets} />
        </div>
        <div className="transaction-table-container">
          <TransactionTable transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Overview;