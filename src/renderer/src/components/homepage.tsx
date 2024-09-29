
import { useState, useEffect } from 'react';
import manticoreLogo from '../assets/manticore.png';
import '../assets/homepage.css'; // Import the CSS for the homepage
import axios from 'axios';
import * as ecc from 'tiny-secp256k1';



const Homepage = (): JSX.Element => {
  const [balance, setBalance] = useState<number>(0);
  // @ts-ignore
  const [transactions, setTransactions] = useState<any[]>([]); // Replace with actual transaction type
  // @ts-ignore
  const [assets, setAssets] = useState<any[]>([]); // Replace with actual asset type
  const [mnemonic, setMnemonic] = useState<string>('');
  const loadFile = async () => {
    const filePath = 'myfile.txt';
    try {
      // @ts-ignore
      const fileExists = await window.electron.fs.exists(filePath);
      if (fileExists) {
        // @ts-ignore
        const fileContent = await window.electron.fs.readFile(filePath, 'utf-8');

        setMnemonic(fileContent);
        const seed = bip39.mnemonicToSeedSync(fileContent);
        const root = bip32.fromSeed(seed);
        const child = root.derivePath("m/44'/175'/0'/0/0");
      }
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  useEffect(() => {
      loadFile();
    const fetchWalletData = async () => {
      const fetchedBalance = await getBalance();
      const fetchedTransactions = await getTransactions();
      const fetchedAssets = await getAssets();
      setBalance(fetchedBalance);
      setTransactions(fetchedTransactions);
      setAssets(fetchedAssets);
    };

    fetchWalletData();

    const fetchAssets = async () => {
      console.log(await apiRequest())
    }
    fetchAssets()
  }, []);



  const apiRequest = async () => {
    const response = await axios.post('https://api.manticore.exchange/evrmore/rpc/listassets')
    return response.data
  }

  const getBalance = async (): Promise<number> => {
    return 6821.49608964; // Replace with actual balance fetching logic
  };

  const getTransactions = async (): Promise<any[]> => {
    return []; // Replace with actual transaction fetching logic
  };

  const getAssets = async (): Promise<any[]> => {
    return [
      { name: 'EVRX', amount: 6216336304.469999936 },
      { name: 'FOSSA', amount: 8999 },
      { name: 'LIBERTA', amount: 1000 },
      { name: 'MAGA', amount: 20242028 },
      { name: 'SUNGOD', amount: 432 },
      { name: 'WOJCOIN', amount: 999900 },
    ]; // Replace with actual asset fetching logic
  };

return (
  <div className="homepage-container">
    <header className="header">
      <img alt="logo" className="logo" src={manticoreLogo} />
      <h1>EVR Balances</h1>
      <div className="balance-info">
        <p>Available: {balance.toFixed(8)} EVR</p>
        <p>Pending: 0.00000000 EVR</p>
        <p>Total: {balance.toFixed(8)} EVR</p>
      </div>
    </header>
    <nav className="sidebar">
      <ul>
        <li><a href="#overview">Overview</a></li>
        <li><a href="#send">Send</a></li>
        <li><a href="#receive">Receive</a></li>
        <li><a href="#transactions">Transactions</a></li>
        <li><a href="#createAssets">Create Assets</a></li>
        <li><a href="#transferAssets">Transfer Assets</a></li>
        <li><a href="#manageAssets">Manage Assets</a></li>
        <li><a href="#restrictedAssets">Restricted Assets</a></li>
      </ul>
    </nav>
    <main className="main-content">
      {/* Other content can go here */}
      <p>{mnemonic}</p>
    </main>
  </div>
);
};

export default Homepage;
