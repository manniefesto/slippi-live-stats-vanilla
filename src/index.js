const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const Store = require('electron-store')
const settingsSchema = {
    slippiReplayDir: {
        type: 'string'
    },
    slippiPlayerCode: {
        type: 'string'
    }
}
const store = new Store({settingsSchema});
const slippiReplayWatcher = require('./modules/slippiReplayWatcher')


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

    mainWindow.loadFile('src/windows/main/main.html')
}

const createPopup = () => {
    popupWindow = new BrowserWindow({
        width: 300,
        height: 300,
        x: 0, y: 0,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'src/windows/popup/popupPreload.js')
        }
    })

    popupWindow.loadFile('src/windows/popup/popup.html')
    popupWindow.setAlwaysOnTop(true, "screen-saver")
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('btnSelectSlippiDirectory-click', () => {
    dialog.showOpenDialog({properties: ['openDirectory']}).then(result => {
        store.set('slippiReplayDir', result.filePaths[0])
        mainWindow.webContents.send('slippiReplayDirUpdated', result.filePaths[0])
    })
})

const showStatsPopup = (settings, stats) => {
    createPopup()
    let arg = { settings: settings, stats: stats }
    popupWindow.webContents.send('update-stats', arg)
    setTimeout(() => { closeStatsPopup()}, 10000)
}

const closeStatsPopup = () => {
    popupWindow.close()
}

app.whenReady().then(() => {
    createWindow()
    slippiReplayWatcher.start(store.get('slippiReplayDir'), () => {
        console.log('Game started')
    }, (gameSettings, stats) => {
        showStatsPopup(gameSettings, stats)
    })
})

// setTimeout(() => {
//     showStatsPopup(null, null)
// }, 1000);