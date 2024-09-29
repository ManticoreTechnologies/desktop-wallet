import React from 'react';
import { FaRegMoneyBillAlt } from 'react-icons/fa'; // Import the desired icon
import './table.css';

interface Transaction {
  id: string;
  date: string;
  time: string; // Added time field
  amount: number;
  status: string;
  assetName: string; // Added asset name field
  address: string; // Added address field
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const formatDateTime = (date: string, time: string) => {
  const dateTime = new Date(`${date}T${time}`);
  const options: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return dateTime.toLocaleString('en-US', options);
};

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <table className="transaction-table">
      <tbody>
        {transactions.map((transaction, index) => (
          <tr key={index}>
            <td className="transaction-icon">
              <FaRegMoneyBillAlt size={24} color="white"/> {/* Use the imported icon here */}
            </td>
            <td className="transaction-details">
              <div className="transaction-date-time">
                <div className="transaction-date-time-formatted">
                  {formatDateTime(transaction.date, transaction.time)}
                </div>
              </div>
              <div className="transaction-address">{transaction.address}</div>
            </td>
            <td className="transaction-asset-amount">
              <div className="transaction-asset-name">{transaction.assetName}</div>
              <div className="transaction-amount">{transaction.amount / 100000000}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;