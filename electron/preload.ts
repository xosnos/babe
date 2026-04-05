import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  showNotification: (title: string, body: string) =>
    ipcRenderer.invoke('show-notification', title, body),
  saveState: (state: unknown) => ipcRenderer.invoke('save-state', state),
  loadState: () => ipcRenderer.invoke('load-state'),
});
