import React, { useEffect, useState } from 'react';
import * as evrmorejs from '../../components/evrmorejs-lib';
import './Recover.css';
import Loading from '../Loading/Loading'; // Ensure Loading is imported
import useWallet from '../../hooks/UseWallet';
import dumpWalletScript from '../../scripts/dumpWallet';
import { getBalance, getReceivedByAddress } from '@renderer/scripts/manticoreAPI';

function Recover({ onWalletCreated }: { onWalletCreated: () => void }): JSX.Element {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const { createWalletFromMnemonic, getWallet, saveWallet, generateNextAddress, generateNextAddresses, setWallet } = useWallet();

  useEffect(() => {
    const checkWallet = async () => {
      const wallet = await getWallet();
      if (wallet) {
        setWallet(wallet);
        onWalletCreated();
      }
    }
    checkWallet();
  }, [])

  const handleMnemonicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMnemonic(value);
    setIsValid(evrmorejs.bip39.validateMnemonic(value));
  };

  const generateMnemonic = () => {
    const newMnemonic = evrmorejs.bip39.generateMnemonic();
    setMnemonic(newMnemonic);
    setIsValid(evrmorejs.bip39.validateMnemonic(newMnemonic));
  };

  const handleCreateWallet = async () => {
    try {
      setMessage('Deriving Addresses...');
      setIsLoading(true);
      setProgress(0);

      /* Create a new wallet from mnemonic */
      await createWalletFromMnemonic(mnemonic);

      /* Generate n addresses and update progress */
      const generateAddresses = async (n: number) => {
        setMessage('Generating Addresses...');
        setIsLoading(true);
        setProgress(0);
        
        const batchSize = n < 10000 ? 1000 : 10000; // Increase batch size to 1000
        for (let i = 0; i < n; i += batchSize) {
          await generateNextAddresses(batchSize, true);
          const targetProgress = Math.min((i + batchSize) / n * 100, 100);
          setProgress(targetProgress);
          await new Promise(resolve => setTimeout(resolve, 10)); // Increase delay for smoother progress
        }

        console.log(await getWallet());
        setProgress(100);
        setMessage('Saving Wallet...'); 
        await saveWallet();
        setIsLoading(false);
        onWalletCreated();
      };

      await generateAddresses(1000);
    } catch (error) {
      console.error('Error creating wallet:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading progress={progress} message={`${message}`} />; // Display Loading component when isLoading is true
  }

  return (
    <div className="container">
      <h1 className="title">Recover Wallet</h1>
      <textarea
        className="large-input"
        placeholder="Enter your mnemonic phrase"
        value={mnemonic}
        onChange={handleMnemonicChange}
      />
      {isValid === null ? null : isValid ? (
        <p className="valid-mnemonic">Mnemonic is valid</p>
      ) : (
        <p className="invalid-mnemonic">Mnemonic is invalid</p>
      )}
      <button className="recover button" onClick={generateMnemonic}>Generate Mnemonic</button>
      <button className="recover button" 
        disabled={isValid === null || !isValid}
        onClick={handleCreateWallet}
      >
        Continue
      </button>
    </div>
  );
};

export default Recover;