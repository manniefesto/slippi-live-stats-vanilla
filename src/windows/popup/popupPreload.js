const { ipcRenderer } = require('electron')

ipcRenderer.on('update-stats', (event, arg) => {
    document.getElementById("p1name").innerText = arg.settings.players[0].displayName
    document.getElementById("p1lcancel").innerText = arg.stats.actionCounts[0].lCancelCount.success + "/" + arg.stats.actionCounts[0].lCancelCount.fail
    document.getElementById('p1logo').src = "images/characters/" + arg.settings.players[0].characterId + "/" + arg.settings.players[0].characterColor + "/stock.png"

    document.getElementById("p2name").innerText = arg.settings.players[1].displayName
    document.getElementById("p2lcancel").innerText = arg.stats.actionCounts[1].lCancelCount.success + "/" + arg.stats.actionCounts[1].lCancelCount.fail
    document.getElementById('p2logo').src = "images/characters/" + arg.settings.players[1].characterId + "/" + arg.settings.players[1].characterColor + "/stock.png"
});