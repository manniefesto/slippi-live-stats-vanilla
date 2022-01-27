// Require ipcRenderer
const { ipcRenderer } = require('electron');

// When the action-update-label event is triggered (from the main process)
// Do something in the view
ipcRenderer.on('update-stats', (event, arg) => {
    // Update the second interface or whatever you need to do
    // for example show an alert ...
    document.getElementById("test").innerText = "test";

    document.getElementById("p1name").innerText = arg.settings.players[0].displayName;
    document.getElementById("p1lcancel").innerText = arg.stats.actionCounts[0].lCancelCount.success + "/" + arg.stats.actionCounts[0].lCancelCount.fail;

    document.getElementById("p2name").innerText = arg.settings.players[1].displayName;
    document.getElementById("p2lcancel").innerText = arg.stats.actionCounts[1].lCancelCount.success + "/" + arg.stats.actionCounts[1].lCancelCount.fail;

});