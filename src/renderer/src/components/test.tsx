import * as React from 'react';
import * as ecc from 'tiny-secp256k1';
import * as evrmorejs from './evrmorejs-lib';
import { BIP32Interface } from './evrmorejs-lib/bip32';
import { Buffer } from 'buffer';

import Sidebar from './Sidebar';



/* Generate a new wallet */
const generateWallet = (): BIP32Interface => {
    const mnemonic = evrmorejs.bip39.generateMnemonic();
    const seed = evrmorejs.bip39.mnemonicToSeedSync(mnemonic);
    const bip32 = evrmorejs.BIP32Factory(ecc);
    const root = bip32.fromSeed(seed);
    return root;
}

/* Save wallet to local storage */
const saveWallet = (wallet: BIP32Interface): void => {
    const walletBinary = Buffer.from(wallet.toBase58(), 'base64');
    window.electron.ipcRenderer.send('save-wallet', walletBinary.toString('binary'));
}

/* Load wallet from local storage */
const loadWallet = async () => {
    // @ts-ignore
    const walletBinary = window.electron.loadWallet();
    console.log(walletBinary);
    return walletBinary; // Ensure you return the walletBinary
}

/* Generate a new address from a wallet */
const generateAddress = (wallet: BIP32Interface): string => {
    const child = wallet.derivePath("m/44'/175'/0'/0/0");
    const {address} = evrmorejs.payments.p2pkh({
      pubkey: child.publicKey,
    });
    return address || '';
}



const Test = (): JSX.Element => {
    const [alarmTime, setAlarmTime] = React.useState<string>('');
    const [currentTime, setCurrentTime] = React.useState<string>(new Date().toLocaleTimeString());

    React.useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().toLocaleTimeString();
            setCurrentTime(now);
            if (now === alarmTime) {
                alert('Alarm ringing!');
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [alarmTime]);

    const handleSetAlarm = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAlarmTime(event.target.value);
    };

    return (
        <div>
            <Sidebar />
            <h1>Alarm Clock</h1>
            <h2>Current Time: {currentTime}</h2>
            <input type="time" onChange={handleSetAlarm} />
            <p>Set your alarm time above.</p>
        </div>
    );
};

export default Test;
