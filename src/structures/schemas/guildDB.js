const { model, Schema } = require("mongoose");

module.exports = model(
    "GuildDB", 
    new Schema({
        id: String,

        logs: {
            enabled: false,
            channel: String,
        },
        welcome: {
            enabled: false,
            channel: String,
            json: Object,
        },
        goodbye: {
            enabled: false,
            channel: String,
            json: Object,
        },
        automod: {
            enabled: false,
        },
    })
)