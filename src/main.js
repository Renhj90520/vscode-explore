const { app, BrowserWindow, ipcMain } = require("electron");
const url = require("url");
const path = require("path");
const execFile = require("child_process").execFile;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      allowRunningInsecureContent: false,
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: `${path.join(__dirname, "../dist")}/favicon.ico`,
    frame: false,
  });
  mainWindow.webContents.openDevTools();

  mainWindow.loadFile(`${path.join(__dirname, "../dist")}/vscode-explore/index.html`);

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (myWindow) {
      if (myWindow.isMinimized()) myWindow.restore();
      myWindow.focus();
    }
  });
  app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
  });

  ipcMain.on("online-status-changed", (evt, status) => {
    console.log(status);
  });

  ipcMain.on("start-emeditor", () => {
    // {
    //   cwd: path.join("D:", "Program Files", "EmEditor"),
    // }
    const threshold = execFile(
      "WeChat",
      ["username", "password"],
      { cwd: path.join("D:", "Program Files", "WeChat") }
      // (error, stdout, stderr) => {
      //   if (error) {
      //     console.error("stderr", stderr);
      //     throw error;
      //   }

      //   console.log(stdout);
      // }
    );
    threshold.stdout.on("data", (data) => {
      debugger;
      console.log(data);
    });

    threshold.stderr.on("data", (data) => {
      debugger;
      console.log(data);
    });
  });

  ipcMain.handle("setFullscreen", (event, flag) => {
    console.log("fullscreen");
    if (mainWindow) {
      console.log(mainWindow);
      mainWindow.setFullScreen(flag);
    }
  });

  ipcMain.on("close", () => {
    app.quit();
  });
}
