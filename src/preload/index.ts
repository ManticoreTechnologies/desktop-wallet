import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import * as fs from 'fs';
import * as path from 'path';
import './popup';
import { Buffer } from 'buffer';

const api = {
  loadWallet: () => {
    return new Promise((resolve, reject) => {
      const filePath = 'wallet.dat';
      fs.readFile(filePath, 'binary', (err, walletBinary) => {
        if (err) reject(err);
        else resolve(Buffer.from(walletBinary, 'binary'));
      });
    });
  },
  fs: {
    writeFile: (filePath: string, data: string) => {
      return new Promise((resolve, reject) => {        
        fs.writeFile(filePath, data, (err) => {
          if (err) reject(err);
          else resolve(null);
        });
      });
    },
    readFile: (filePath: string) => {
      return new Promise((resolve, reject) => {        
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    },
    exists: (filePath: string) => {
      return new Promise((resolve) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
          resolve(!err);
        });
      });
    },
    continue: (mnemonic: string) => {
      ipcRenderer.send('continue', mnemonic);
    },
    path: {
      join: (...args: string[]) => path.join(...args),
    },
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      ...api,
      ...fs
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore
  window.electron = electronAPI;
}
