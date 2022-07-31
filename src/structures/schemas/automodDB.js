const { model, Schema } = require("mongoose");

module.exports = model(
    "AutoMod",
    new Schema({
        id: String,

        UserID: String,
        ChannelIDs: Array,
        KickData: Array,
        BanData: Array,

        Punishments: Array,
        LogChannelID: Array,
        BypassRoles: Array,
    })
);
