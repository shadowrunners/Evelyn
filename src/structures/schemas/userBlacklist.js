const { model, Schema } = require("mongoose");

module.exports = model(
  "UserBlacklist",
  new Schema({
    userID: String,
    reason: String,
    time: Number,
  })
);
