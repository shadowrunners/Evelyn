const { model, Schema } = require("mongoose");

module.exports = model(
  "Lockdowns",
  new Schema({
    guildId: String,
    channelId: String,
    timeLocked: String,
  })
);
