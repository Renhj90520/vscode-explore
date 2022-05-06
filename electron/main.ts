import { app, BrowserWindow, ipcMain } from 'electron';
import * as url from 'url';
import * as path from 'path';
import * as child_process from 'child_process';
const execFile = child_process.execFile;
let mainWindow: any;
import {
  getTitleBarStyle,
  TitleBarStyle,
} from './platform/window/common/window';
import { isMacintosh } from './base/common/platform';

function createWindow() {
  const options: any = {
    width: 800,
    height: 600,
    webPreferences: {
      allowRunningInsecureContent: false,
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: `${__dirname}/favicon.ico`,
  };

  const useCustomTitleStyle = getTitleBarStyle() === TitleBarStyle.custom;
  if (useCustomTitleStyle) {
    options.titleBarStyle = 'hidden';

    if (!isMacintosh) {
      options.frame = false;
    }
  }
  debugger;

  mainWindow = new BrowserWindow(options);
  mainWindow.webContents.openDevTools();

  mainWindow.loadFile(`${__dirname}/index.html`);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
  });

  ipcMain.on('online-status-changed', (evt, status) => {
    console.log(status);
  });

  ipcMain.on('start-emeditor', () => {
    // {
    //   cwd: path.join("D:", "Program Files", "EmEditor"),
    // }
    const threshold: any = execFile(
      'WeChat',
      ['username', 'password'],
      { cwd: path.join('D:', 'Program Files', 'WeChat') }
      // (error, stdout, stderr) => {
      //   if (error) {
      //     console.error("stderr", stderr);
      //     throw error;
      //   }

      //   console.log(stdout);
      // }
    );
    if (threshold) {
      threshold.stdout.on('data', (data) => {
        debugger;
        console.log(data);
      });

      threshold.stderr.on('data', (data) => {
        debugger;
        console.log(data);
      });
    }
  });

  ipcMain.handle('setFullscreen', (event, flag) => {
    console.log('fullscreen');
    if (mainWindow) {
      console.log(mainWindow);
      mainWindow.setFullScreen(flag);
    }
  });

  ipcMain.on('close', () => {
    app.quit();
  });
}
