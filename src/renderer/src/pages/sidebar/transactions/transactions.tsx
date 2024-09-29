import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';

const Transactions = (): JSX.Element => {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      // Replace with actual transaction fetching logic
      const fetchedTransactions = await getTransactions();
      setTransactions(fetchedTransactions);
    };

    fetchTransactions();
  }, []);

  const getTransactions = async (): Promise<any[]> => {
    // Replace with actual transaction fetching logic
    return [
      { id: 1, date: '2023-01-01', amount: 100, type: 'send' },
      { id: 2, date: '2023-01-02', amount: 200, type: 'receive' },
      { id: 3, date: '2023-01-03', amount: 300, type: 'send' },
    ];
  };

  return (
    <div>
      <h1>Transactions</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.date}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
