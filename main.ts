import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null;

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 1024,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.maximize();
    mainWindow.setAlwaysOnTop(true);
    mainWindow.on('closed', () => mainWindow = null);

    setTimeout(() => {
        if (mainWindow) {
            mainWindow.setAlwaysOnTop(false);
        }
    }, 1000);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (!mainWindow) {
        createWindow();
    }
});
