'use strict';

const { app: electronApp, BrowserWindow } = require('electron');
const { start } = require('./src/server/index');
const { PORT } = require('./src/server/config');

const SERVER_URL = `http://localhost:${PORT}`;

/** @type {BrowserWindow | null} */
let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 800,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    setTimeout(() => {
        mainWindow?.loadURL(SERVER_URL);
    }, 1000);
}

start();

electronApp.whenReady().then(() => {
    createWindow();

    electronApp.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

electronApp.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electronApp.quit();
    }
});
