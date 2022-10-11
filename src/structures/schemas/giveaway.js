const { model, Schema } = require("mongoose");

module.exports = model(
  "Giveaway",
  new Schema({
    id: String,
    channel: String,
    messageID: String,
    winners: Number,
    prize: String,
    endTime: String,
    isPaused: Boolean,
    hasEnded: Boolean,
    hoster: String,
    enteredUsers: [String],
  })
);
