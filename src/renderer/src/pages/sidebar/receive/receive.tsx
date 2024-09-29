import Sidebar from '../../../components/Sidebar';
import { CSSTransition } from 'react-transition-group';
import { useEffect, useState } from 'react';
import './receive.css'; // Import the CSS file
import useWallet from '@renderer/hooks/UseWallet';

const Receive = (): JSX.Element => {
  const [inProp, setInProp] = useState(false);
  const { getWallet } = useWallet();
  const [addresses, setAddresses] = useState<any>([]);
  const handleGenerateNextAddress = () => {
    setInProp(true);
    setTimeout(() => setInProp(false), 500); // duration should match the CSS transition duration
  };

  useEffect(() => {
    const fetchData = async () => {
      const wallet = await getWallet();
      setAddresses(wallet.addresses);
    };
    fetchData();
  }, [getWallet]);

  return (
    <div className='container'>
      <h1>Receive Page</h1>
      <CSSTransition in={inProp} timeout={500} classNames="fade">
        <h2> test </h2>
      </CSSTransition>
      <button onClick={handleGenerateNextAddress}>Generate New Address</button>
      <div className="address-list">
        <h2>Wallet Addresses</h2>
        <ul>
          {addresses.map((address, index) => (
            <li key={index}>{address.address} @ {address.path}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Receive;