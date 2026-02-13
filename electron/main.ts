import { app, BrowserWindow, shell, ipcMain, Notification } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeDatabase, saveState, loadState, closeDatabase } from './db';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow: BrowserWindow | null = null;

// Allowed external domains for security
const ALLOWED_DOMAINS = ['www.canva.com', 'calendar.google.com'];

/**
 * Validates if a URL is safe to open externally.
 * - Must use HTTPS protocol
 * - Must be on the allowlist
 */
function isValidExternalUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);

    // Only allow HTTPS
    if (url.protocol !== 'https:') {
      return false;
    }

    // Check if domain is whitelisted
    return ALLOWED_DOMAINS.includes(url.hostname);
  } catch {
    // Invalid URL format
    return false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#FFF0F3',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../build/icon.png'),
  });

  if (process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.webContents.on('will-navigate', (event) => {
    event.preventDefault();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isValidExternalUrl(url)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC: Open external URL
ipcMain.handle('open-external', async (_event, url: string) => {
  // Validate URL for security
  if (!isValidExternalUrl(url)) {
    return { success: false, error: 'URL not allowed' };
  }

  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// IPC: Show notification
ipcMain.handle('show-notification', (_event, title: string, body: string) => {
  // Validate input lengths to prevent memory/UI issues
  if (typeof title !== 'string' || typeof body !== 'string') {
    return { success: false, error: 'Invalid notification parameters' };
  }

  if (title.length > 256 || body.length > 1024) {
    return { success: false, error: 'Notification text too long' };
  }

  if (Notification.isSupported()) {
    const notification = new Notification({ title, body });
    notification.show();
    return { success: true };
  }
  return { success: false, error: 'Notifications not supported' };
});

// IPC: Save application state
ipcMain.handle('save-state', (_event, state: any) => {
  try {
    const success = saveState(state);
    return { success };
  } catch (error) {
    console.error('Error saving state:', error);
    return { success: false, error: String(error) };
  }
});

// IPC: Load application state
ipcMain.handle('load-state', () => {
  try {
    const state = loadState();
    return { success: !!state, data: state };
  } catch (error) {
    console.error('Error loading state:', error);
    return { success: false, error: String(error) };
  }
});

app.whenReady().then(() => {
  // Initialize database
  initializeDatabase();

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  closeDatabase();
});
