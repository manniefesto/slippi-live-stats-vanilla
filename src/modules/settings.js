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

exports.store = store;