const { model, Schema } = require("mongoose");

module.exports = model(
  "Reminders",
  new Schema({
    guildId: String,
    channelId: String,
    messageId: String,
    userId: String,
    reminder: String,
    scheduledTime: String,
    hasBeenReminded: Boolean,
  })
);
