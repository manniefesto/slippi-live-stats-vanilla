const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const slippiReplayWatcher = require('./modules/slippiReplayWatcher')
const settings = require('./modules/settings')
const fs = require('fs')


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
        width: 800,
        height: 300,
        x: 0, y: 0,
        frame: true,
        webPreferences: {
            preload: path.join(__dirname, 'windows/popup/popupPreload.js')
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
        settings.store.set('slippiReplayDir', result.filePaths[0])
        mainWindow.webContents.send('slippiReplayDirUpdated', result.filePaths[0])
    })
})

const showStatsPopup = (settings, stats) => {
    createPopup()
    let arg = { settings: settings, stats: stats }
    console.log(arg)
    popupWindow.webContents.send('update-stats', arg)
    //setTimeout(() => { closeStatsPopup()}, 10000)
}

const closeStatsPopup = () => {
    popupWindow.close()
}

app.whenReady().then(() => {
    createWindow()
    slippiReplayWatcher.start(settings.store.get('slippiReplayDir'), () => {
        closeStatsPopup()
    }, (gameSettings, stats) => {
        showStatsPopup(gameSettings, stats)
    })
})

setTimeout(() => {
    fs.readFile('./exampleData/stats.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file from disk: ${err}`)
        } else {
            // parse JSON string to JSON object
            const statsFile = JSON.parse(data)
            showStatsPopup(statsFile.settings, statsFile.stats)
        }
    });
}, 1000);