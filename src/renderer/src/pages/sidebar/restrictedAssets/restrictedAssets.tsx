import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';

const RestrictedAssets = (): JSX.Element => {
  const [assetName, setAssetName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [units, setUnits] = useState('');
  const [reissuable, setReissuable] = useState(false);
  const [addIpfs, setAddIpfs] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');

  const handleCreateRestrictedAsset = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      assetName,
      quantity,
      units,
      reissuable,
      addIpfs,
      ipfsHash
    });
    // Add your create restricted asset logic here
  };

  return (
    <div>
      <h1>Create Restricted Asset</h1>
      <form onSubmit={handleCreateRestrictedAsset}>
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
          <label htmlFor="units">Units:</label>
          <input
            type="text"
            id="units"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="reissuable">Reissuable:</label>
          <input
            type="checkbox"
            id="reissuable"
            checked={reissuable}
            onChange={(e) => setReissuable(e.target.checked)}
          />
        </div>
        <div>
          <label htmlFor="addIpfs">Add IPFS:</label>
          <input
            type="checkbox"
            id="addIpfs"
            checked={addIpfs}
            onChange={(e) => setAddIpfs(e.target.checked)}
          />
        </div>
        {addIpfs && (
          <div>
            <label htmlFor="ipfsHash">IPFS Hash:</label>
            <input
              type="text"
              id="ipfsHash"
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit">Create Restricted Asset</button>
      </form>
    </div>
  );
};

export default RestrictedAssets;
