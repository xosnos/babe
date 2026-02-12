import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('electronAPI', {
    openExternal: (url) => ipcRenderer.invoke('open-external', url),
    showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body),
});
