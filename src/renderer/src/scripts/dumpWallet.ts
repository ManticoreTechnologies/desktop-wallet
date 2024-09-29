import {bip39} from '../components/evrmorejs-lib'
import { getBlockCount, getBlockHash, getBlockTime } from './manticoreAPI';

const generateHeader = async () => {
  const blockCount = await getBlockCount();
  const blockHash = await getBlockHash(blockCount);
  const blockTime = await getBlockTime(blockHash);
  const header = `# Wallet dump created by Manticore v1.0.0\n` +
  `# * Created on ${new Date().toISOString().split('.')[0]}Z\n` +
  `# * Best block at time of backup was ${blockCount} (${blockHash}),\n` +
  `#   mined on ${new Date(blockTime * 1000).toISOString().split('.')[0]}Z\n` +
  `\n`;

  return header;
};

const generateRootKeys = (wallet: {mnemonic: string}) => {
    const mnemonic = wallet.mnemonic
    // Normalize mnemonic using NFKD normalization
    const normalizedMnemonic = mnemonic.normalize('NFKD');
  
    // Generate the BIP39 seed from the mnemonic (this is just for other purposes, not for hash of words)
    const seed = bip39.mnemonicToSeedSync(normalizedMnemonic);
  
    // Create the wallet dump information
    //@ts-ignore
    const rootKeys = `# extended private masterkey: ${wallet.root.toBase58()}\n\n` +
      //@ts-ignore
      `# extended public masterkey: ${wallet.root.neutered().toBase58()}\n\n` +
      `# HD seed: ${seed.toString('hex')}\n` +
      `# mnemonic: ${mnemonic}\n` +
      `# mnemonic passphrase: \n` +  // No passphrase in this case
      `# hash of words: ${bip39.mnemonicToEntropy(mnemonic)}\n\n`;  // Print the HMAC-SHA512 (truncated) hash of the mnemonic
  
    console.log(rootKeys);
  
    return rootKeys;
  };
  
const generateAddressKeys = (wallet: any) => {
    const addresses = wallet.addresses
    let addressKeys = ``
    for(let i = 0; i < addresses.length; i++) {
        const address = addresses[i]
        addressKeys += `${address.wif} ${address.date.toISOString().split('.')[0]}Z ${address.reserve ? 'reserve=1' : `label=${address.label}`} # addr=${address.address} hdkeypath=${address.path}\n`
    }
    return addressKeys
}

const dumpWalletScript = async (wallet: any) => {
  /* returns {
    mnemonic: string;
    addresses: string[];
    root: BIP32Interface;
  } */
  
  // Wallet dump header
  const header = await generateHeader();
  const rootKeys = generateRootKeys(wallet);
  const addressKeys = generateAddressKeys(wallet)
  return header + rootKeys + addressKeys;
};

export default dumpWalletScript;
