const { model, Schema } = require("mongoose");

module.exports = model(
  "GuildDB",
  new Schema({
    id: String,

    logs: {
      enabled: false,
      channel: String,
      webhook: {
        id: String,
        token: String,
      },
    },
    welcome: {
      enabled: false,
      channel: String,
      message: String,
      json: Object,
    },
    goodbye: {
      enabled: false,
      channel: String,
      message: String,
      json: Object,
    },
    blacklist: {
      isBlacklisted: false,
      reason: String,
      time: String,
    },
    tickets: {
      enabled: false,
      channel: String,
      panelJSON: Object,
      category: String,
      transcriptChannel: String,
      ticketHandlers: String,
    },
    levels: {
      enabled: false,
      channel: String,
      message: String,
    },
    starboard: {
      enabled: false,
      channel: String,
    },
  })
);
