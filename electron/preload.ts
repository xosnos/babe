import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  showNotification: (title: string, body: string) =>
    ipcRenderer.invoke('show-notification', title, body),
});
