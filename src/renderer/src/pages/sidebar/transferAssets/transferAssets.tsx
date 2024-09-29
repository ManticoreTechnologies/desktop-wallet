import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';

const TransferAssets = (): JSX.Element => {
  const [toAddress, setToAddress] = useState('');
  const [assetName, setAssetName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');

  const handleTransferAsset = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      toAddress,
      assetName,
      quantity,
      ipfsHash
    });
    // Add your transfer asset logic here
  };

  return (
    <div>
      <h1>Transfer Asset</h1>
      <form onSubmit={handleTransferAsset}>
        <div>
          <label htmlFor="toAddress">To Address:</label>
          <input
            type="text"
            id="toAddress"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="assetName">Asset Name:</label>
          <input
            type="text"
            id="assetName"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="ipfsHash">IPFS Hash:</label>
          <input
            type="text"
            id="ipfsHash"
            value={ipfsHash}
            onChange={(e) => setIpfsHash(e.target.value)}
          />
        </div>
        <button type="submit">Transfer Asset</button>
      </form>
    </div>
  );
};

export default TransferAssets;
