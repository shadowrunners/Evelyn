const { model, Schema } = require("mongoose");

module.exports = model(
  "ServerBlacklist",
  new Schema({
    serverID: String,
    reason: String,
    time: Number,
  })
);
