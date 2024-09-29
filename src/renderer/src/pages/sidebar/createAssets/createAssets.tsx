import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';

const CreateAssets = (): JSX.Element => {
  const [assetType, setAssetType] = useState('main');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [units, setUnits] = useState('');
  const [reissuable, setReissuable] = useState(false);
  const [addIpfs, setAddIpfs] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      assetType,
      name,
      quantity,
      units,
      reissuable,
      addIpfs,
      ipfsHash
    });
    // Add your create asset logic here
  };

  return (
    <div>
      <h1>Create New Asset</h1>
      <form onSubmit={handleCreateAsset}>
        <div>
          <label htmlFor="assetType">Asset Type:</label>
          <select
            id="assetType"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
          >
            <option value="main">Main Asset</option>
            <option value="sub">Sub Asset</option>
          </select>
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <button type="submit">Create Asset</button>
      </form>
    </div>
  );
};

export default CreateAssets;
