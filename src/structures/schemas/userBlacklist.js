const { model, Schema } = require("mongoose");

module.exports = model(
  "UserBlacklist",
  new Schema({
    userid: String,
    reason: String,
    time: Number,
  })
);
