import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import './send.css'; // Import the CSS file

const Send = (): JSX.Element => {
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('EVR');
  const [subtractFee, setSubtractFee] = useState(false);
  const [fee, setFee] = useState('low');

  const handleSend = () => {
    console.log({
      address,
      label,
      amount,
      currency,
      subtractFee,
      fee
    });
    // Add your send logic here
  };

  return (
    <div className="container">

      <div className="send-container">
        <input type="text" className="small-input" placeholder="Address" />
        <input type="text" className="small-input" placeholder="Label" />
        <input type="text" className="small-input" placeholder="Amount" />
        <input type="text" className="small-input" placeholder="Currency" />
        <input type="text" className="small-input" placeholder="Subtract Fee" />
        <input type="text" className="small-input" placeholder="Fee" />
      </div>

    </div>
  );
};

export default Send;
