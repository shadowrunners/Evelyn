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
    tickets: {
      enabled: false,
      channel: String,
      category: String,
      transcripts: String,
      handlers: String,
      description: String,
    },
    antiscam: {
      enabled: false,
      channel: String,
    },
    notifications: {
      twitch_enabled: false,
      twitch_channel: String,
      twitch_notifications_channel: String,

      youtube_enabled: false,
      youtube_channel: String,
      youtube_notifications_channel: String,
    },
  })
);
