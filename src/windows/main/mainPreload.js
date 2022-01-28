const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnSelectSlippiDirectory').addEventListener('click', () => {
        ipcRenderer.send('btnSelectSlippiDirectory-click')
    })
})

ipcRenderer.on('slippiReplayDirUpdated', (event, arg) => {
    document.getElementById('tbSlippiDirectory').value = arg
})