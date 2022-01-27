const { app, BrowserWindow } = require('electron')
const path = require('path');
const { ipcMain, ipcRenderer } = require('electron');

let mainWindow;
let popupWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'windows/main/mainPreload.js')
        }
    })

    mainWindow.loadFile('windows/main/main.html')
}

const createPopup = () => {
    popupWindow = new BrowserWindow({
        width: 300,
        height: 300,
        x: 0, y: 0,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'windows/popup/popupPreload.js')
        }
    })

    popupWindow.loadFile('windows/popup/popup.html')
    popupWindow.setAlwaysOnTop(true, "screen-saver")
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

const { SlippiGame } = require("@slippi/slippi-js");
const chokidar = require("chokidar");
const _ = require("lodash");
const { stat } = require('fs');

const listenPath = "C:\\Users\\hyp3r\\Documents\\Slippi";

const watcher = chokidar.watch(listenPath, {
    ignored: "!*.slp", // TODO: This doesn't work. Use regex?
    depth: 0,
    persistent: true,
    usePolling: true,
    ignoreInitial: true,
});

const gameByPath = {};
watcher.on("change", (path) => {
    let gameState, settings, stats, frames, latestFrame, gameEnd;
    try {
        let game = _.get(gameByPath, [path, "game"]);
        if (!game) {
            game = new SlippiGame(path, { processOnTheFly: true });
            gameByPath[path] = {
                game: game,
                state: {
                    settings: null,
                    detectedPunishes: {},
                },
            };
        }

        gameState = _.get(gameByPath, [path, "state"]);
        settings = game.getSettings();
        frames = game.getFrames();
        latestFrame = game.getLatestFrame();
        gameEnd = game.getGameEnd();

        if (gameEnd) stats = game.getStats();
    } catch (err) {
        console.error(err);
        return;
    }

    if (!gameState.settings && settings) {
        gameState.settings = settings;
        closeStatsPopup();
    }

    if (gameEnd) {
        showStatsPopup(settings, stats);
    }
});

const showStatsPopup = (settings, stats) => {
    createPopup();
    let arg = { settings: settings, stats: stats };
    popupWindow.webContents.send('update-stats', arg);
    setTimeout(() => { closeStatsPopup()}, 10000)
}

const closeStatsPopup = () => {
    popupWindow.close();
}

setTimeout(() => {
    showStatsPopup(null, null)
}, 1000);