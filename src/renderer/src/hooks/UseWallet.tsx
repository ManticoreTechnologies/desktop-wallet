import { useRef, useState } from 'react';

import { BIP32Interface, BIP32Factory, payments} from '../components/evrmorejs-lib';
import * as bip39 from '../components/evrmorejs-lib/bip39';
import { evrmore as network } from '../components/evrmorejs-lib/Networks';
import * as ecc from 'tiny-secp256k1'
import dumpWalletScript from '../scripts/dumpWallet'
import { Buffer } from 'buffer';
import { getBalance, getReceivedByAddress, getReceivedByAddresses, getAddressMempool } from '@renderer/scripts/manticoreAPI';
import parseWallet from '@renderer/scripts/parseWallet';
const bip32 = BIP32Factory(ecc)


class Address {
    wif: string;
    path: string;
    address: string;
    date: Date;
    label: string;
    reserve: boolean;

    constructor(wif: string, path: string, address: string, date: Date, reserve: boolean = false, label: string = '') {
        this.wif = wif;
        this.path = path;
        this.address = address;
        this.date = date;
        this.label = label;
        this.reserve = reserve;
    }
}



class Wallet {
  mnemonic: string;
  addresses: Address[];
  root: BIP32Interface;
  balance: number;
  pendingBalance: number;
  constructor(mnemonic: string) {
    this.mnemonic = mnemonic;
    this.addresses = [];
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    this.root = bip32.fromSeed(seed, network);
    this.balance = 0;
    this.pendingBalance = 0;
  }

  async updateBalance(){
    this.balance = await getBalance(this.addresses.map(address => address.address));
  }
  async updatePendingBalance(){
    const mempoolData = await getAddressMempool(this.addresses.map(address => address.address));
    this.pendingBalance = mempoolData.reduce((acc, curr) => acc + parseInt(curr.satoshis), 0);
    console.log(this.pendingBalance);
  }

  addAddresses(addresses: Address[]) {
    this.addresses = this.addresses.concat(addresses);
  }

  dump() {
    return dumpWalletScript(this);
  }
}

const useWallet = () => {
  const walletRef = useRef<Wallet | null>(null);
  const [walletLoaded, setWalletLoaded] = useState<boolean>(false);

  const getWallet = async () => {
    if(walletRef.current) {
      return walletRef.current;
    }
    const exists = await window.electron.fs.exists("wallet.dat")
    if (exists) {
      const wallet = parseWallet(await window.electron.fs.readFile("wallet.dat"))
      walletRef.current = wallet;
      setWalletLoaded(true);
      return wallet;
    }
    return null;
  }

  const setWallet = (wallet: Wallet) => {
    walletRef.current = wallet;
    setWalletLoaded(true);
  }
  const getAddresses = () => {
    return walletRef.current?.addresses || [];
  }
  const walletExists = (callback: (exists: boolean) => void) => {
    window.electron.fs.exists("wallet.dat", (exists: boolean) => {
        setWalletLoaded(exists);
        callback(exists);
    });
  }
  const createWalletFromMnemonic = async (mnemonic: string) => {
    const newWallet = new Wallet(mnemonic);
    walletRef.current = newWallet;
    setWalletLoaded(true);
    return newWallet;
  };

  const generateFirstXAddresses = (x: number, reserve: boolean = false) => {
    if (walletRef.current) {
        for (let i = 0; i < x; i++) {
            const path = reserve ? `m/44'/175'/0'/1/${i}` : `m/44'/175'/0'/0/${i}`;
            const derived = walletRef.current.root.derivePath(path);
            const address = payments.p2pkh({
                pubkey: derived.publicKey
            });
            walletRef.current.addAddresses([new Address(derived.toWIF(), path, address.address || '', new Date(), reserve)]);
        }
        return;
    }
    return [];
  };

  const generateNextAddress = async (return_received: boolean = false) => {
    if (walletRef.current) {
      let index = walletRef.current.addresses.length/2;
      if (index < 0) {
        index = 0;
      }
      // Generate non-reserve address
      const nonReservePath = `m/44'/175'/0'/0/${index}`;
      const nonReserveDerived = walletRef.current.root.derivePath(nonReservePath);
      const nonReserveAddress = payments.p2pkh({
        pubkey: nonReserveDerived.publicKey
      });
      walletRef.current.addAddresses([new Address(nonReserveDerived.toWIF(), nonReservePath, nonReserveAddress.address || '', new Date(), false)]);

      // Generate reserve address
      const reservePath = `m/44'/175'/0'/1/${index}`;
      const reserveDerived = walletRef.current.root.derivePath(reservePath);
      const reserveAddress = payments.p2pkh({
        pubkey: reserveDerived.publicKey
      });
      walletRef.current.addAddresses([new Address(reserveDerived.toWIF(), reservePath, reserveAddress.address || '', new Date(), true)]);

      if (return_received) {
        const received = await getReceivedByAddress(nonReserveAddress.address || '');
        return received;
      }
      return null;
    }
  }

  const generateNextAddresses = async (count: number, return_received: boolean = false) => {
    if (walletRef.current) {
      const addresses = [];
      const startIndex = walletRef.current.addresses.length / 2;
      const endIndex = startIndex + count;
      for (let i = startIndex; i < endIndex; i++) {
        // Generate non-reserve address
        const nonReservePath = `m/44'/175'/0'/0/${i}`;
        const nonReserveDerived = walletRef.current.root.derivePath(nonReservePath);
        const nonReserveAddress = payments.p2pkh({
          pubkey: nonReserveDerived.publicKey
        });
        addresses.push(nonReserveAddress.address || '');
        walletRef.current.addAddresses([new Address(nonReserveDerived.toWIF(), nonReservePath, nonReserveAddress.address || '', new Date(), false)]);

        // Generate reserve address
        const reservePath = `m/44'/175'/0'/1/${i}`;
        const reserveDerived = walletRef.current.root.derivePath(reservePath);
        const reserveAddress = payments.p2pkh({
          pubkey: reserveDerived.publicKey
        });
        addresses.push(reserveAddress.address || '');
        walletRef.current.addAddresses([new Address(reserveDerived.toWIF(), reservePath, reserveAddress.address || '', new Date(), true)]);
      }
      if (return_received) {
        const received = await getReceivedByAddresses(addresses);
        return received;
      }
      return [];
    }
    return [];
  };

  const saveWallet = async () => {
    if (walletRef.current) {
        console.log("saving wallet")
        //@ts-ignore
      await window.electron.fs.writeFile("wallet.dat", await walletRef.current.dump());
    }
  }

  const dumpWallet = () => {
    if (walletRef.current) {
      const dumpedData = walletRef.current.dump();
      console.log('Dumping wallet:', dumpedData);
      return dumpedData;
    }
    return null;
  };

  return {
    createWalletFromMnemonic,
    generateNextAddress,
    generateNextAddresses,
    generateFirstXAddresses,
    getAddresses,
    getWallet,
    dumpWallet,
    saveWallet,
    walletExists,
    setWallet,
    wallet: walletRef,
    walletLoaded,
  };
};

export default useWallet;
