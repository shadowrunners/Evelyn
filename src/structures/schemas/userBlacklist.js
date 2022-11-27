const { model, Schema } = require("mongoose");

module.exports = model(
  "UBlacklist",
  new Schema({
    userId: String,
    reason: String,
    time: Number,
  })
);
