import React from 'react';
import './table.css';

interface Asset {
  assetName: string;
  balance: number;
}

interface AssetTableProps {
  assets: Asset[];
}

const AssetTable: React.FC<AssetTableProps> = ({ assets }) => {
  return (
    <table className="asset-table">
      <tbody>
        {assets.map((asset, index) => (
          <tr key={index}>
            <td className="asset-cell">
              <div className="asset-name">{asset.assetName}</div>
              <div className="asset-balance">{asset.balance/100000000}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AssetTable;