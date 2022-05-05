const { ipcRenderer, contextBridge } = require("electron");
contextBridge.exposeInMainWorld("electron-api", {});

contextBridge.exposeInMainWorld("api", {
  send: (channel, ...arg) => {
    ipcRenderer.send(channel, arg);
  },
  sendSync: (channel, ...arg) => {
    return ipcRenderer.sendSync(channel, arg);
  },
  on: (channel, listener) => {
    ipcRenderer.on(channel, listener);
  },
  once: (channel, listener) => {
    ipcRenderer.once(channel, listener);
  },
  removeListener: (channel, listener) => {
    ipcRenderer.removeListener(channel, listener);
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  setFullscreen: (flag) => ipcRenderer.invoke("setFullscreen", flag),
});
