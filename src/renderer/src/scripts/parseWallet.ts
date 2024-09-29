import { BIP32Interface, BIP32Factory, payments } from '../components/evrmorejs-lib';
import * as bip39 from '../components/evrmorejs-lib/bip39';
import { evrmore as network } from '../components/evrmorejs-lib/Networks';
import * as ecc from 'tiny-secp256k1';
import { Buffer } from 'buffer';
import dumpWalletScript from './dumpWallet';
import { getAddressBalance, getAddressMempool, getBalance } from './manticoreAPI';
const bip32 = BIP32Factory(ecc);

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
      this.balance = await getAddressBalance(this.addresses.map(address => address.address));
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
const parseWallet = (walletDump: string): Wallet => {
    const lines = walletDump.split('\n');
    let mnemonic = '';
    const addresses: Address[] = [];

    for (const line of lines) {
        if (line.startsWith('# mnemonic:')) {
            mnemonic = line.split(': ')[1].trim();
        } else if (!line.startsWith('#') && line.trim() !== '') {
            const [wif, dateLabel, , , addrLabel] = line.split(' ');
            const date = new Date(dateLabel);
            const label = addrLabel.split('=')[1] || '';
            const reserve = line.includes('reserve=1');
            const path = line.match(/hdkeypath=([^\s]+)/)?.[1] || '';
            const address = line.match(/addr=([^\s]+)/)?.[1] || '';
            addresses.push(new Address(wif, path, address, date, reserve, label));
        }
    }

    const wallet = new Wallet(mnemonic);
    wallet.addAddresses(addresses);
    return wallet;
};

export default parseWallet;
