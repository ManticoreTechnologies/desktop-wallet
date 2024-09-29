import { app, shell, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  // Create the menu
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Preferences',
          click: () => {
            console.log('Preferences clicked');
          },
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Wallet',
      submenu: [
        {
          label: 'options',
          click: () => {
            console.log('About clicked');
          },
        },
        {
          label: 'Backup',
          click: () => {
              const popupWindow = new BrowserWindow({
                  width: 400,
                  height: 300,
                  parent: mainWindow,
                  modal: true,
                  webPreferences: {
                      preload: join(__dirname, '../renderer/popup.js'),
                  },
              });

              // Load the popup HTML
              popupWindow.loadFile(join(__dirname, '../renderer/popup.html'));

              // Send the mnemonic after the window has finished loading
              const mnemonic = fs.readFileSync('myfile.txt', 'utf-8');
              popupWindow.webContents.on('did-finish-load', () => {
                  popupWindow.webContents.send('send-mnemonic', mnemonic);
              });
          },
      },
      ],
    },
    {
      label: 'Connect',
      submenu: [
        {
          label: 'Connect to Server',
          click: () => {
            console.log('Connect to Server clicked');
          },
        },
      ],
    },
  ]);
  
  Menu.setApplicationMenu(menu);
  mainWindow.setMenuBarVisibility(true);
  
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}
// @ts-ignore
ipcMain.on('save-wallet', async (event, walletBinary) => {
  const filePath = 'wallet.dat';
  await fs.promises.writeFile(filePath, walletBinary, 'binary');
  console.log(`Wallet saved to: ${filePath}`);
});

// @ts-ignore
ipcMain.on('save-file', async (event, content) => {
  const result = await dialog.showSaveDialog({
    
    title: 'Save File',
    defaultPath: 'untitled.txt',
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (!result.canceled && result.filePath) {
    await fs.promises.writeFile(result.filePath, content);
    console.log(`File saved to: ${result.filePath}`);
  }
});

ipcMain.on('read-file', async (event, filePath) => {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  event.reply('file-read', content);
});

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  ipcMain.on('ping', () => console.log('pooooong'));

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
