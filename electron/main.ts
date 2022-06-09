import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as child_process from 'child_process';
const execFile = child_process.execFile;
let mainWindow: any;
import {
  getTitleBarStyle,
  TitleBarStyle,
  useNativeFullScreen,
  WindowMinimumSize,
  WindowSettings,
} from './platform/window/common/window';
import { isMacintosh } from './base/common/platform';
import MenuBar from './platform/menubar/menubar';

function createWindow() {
  const options: any = {
    width: 800,
    height: 600,
    minWidth: WindowMinimumSize.WIDTH,
    minHeight: WindowMinimumSize.HEIGHT,
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

  if (isMacintosh && !useNativeFullScreen()) {
    options.fullscreenable = false;
  }

  if (isMacintosh) {
    options.acceptFirstMouse = true;
    if (WindowSettings.clickThroughInactive === false) {
      options.acceptFirstMouse = false;
    }
  }

  const useNativeTabs = isMacintosh && WindowSettings.nativeTabs === true;
  if (useNativeTabs) {
    options.tabbingIdentifier = 'vscode-explore';
  }

  const useCustomTitleStyle = getTitleBarStyle() === TitleBarStyle.custom;
  if (useCustomTitleStyle) {
    options.titleBarStyle = 'hidden';

    if (!isMacintosh) {
      options.frame = false;
    }
  }

  mainWindow = new BrowserWindow(options);

  // mainWindow.webContents.openDevTools();

  if (isMacintosh && useCustomTitleStyle) {
    mainWindow.setSheetOffset(22); // offset dialogs by the height of the custom title bar if we have any
  }

  mainWindow.loadFile(`${__dirname}/index.html`);

  ipcMain.on('get-window-state', (event) => {
    if (mainWindow) {
      event.reply('window-state', mainWindow.isMaximized());
    }
  });

  ipcMain.on('minimize-window', (event) => {
    if (mainWindow) {
      mainWindow.minimize();
    }
  });

  ipcMain.on('toggle-window-maximize', (event) => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on('close-window', (event) => {
    if (mainWindow) {
      mainWindow = null;
    }
    app.quit();
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-state', true);
  });
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-state', false);
  });
  mainWindow.on('closed', function () {
    mainWindow = null;
    app.quit();
  });

  initMenuBar();
}

function initMenuBar() {
  const menubar = new MenuBar();
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

  ipcMain.on('close', () => {
    app.quit();
  });
}
