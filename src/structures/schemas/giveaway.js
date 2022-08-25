const { model, Schema } = require("mongoose");

module.exports = model(
  "Giveaway",
  new Schema({
    ID: String,
    ChannelID: String,
    MessageID: String,
    Winners: Number,
    Level: Number,
    Prize: String,
    EndTime: String,
    Paused: Boolean,
    Ended: Boolean,
    HostedBy: String,
    Entered: [String],
  })
);
