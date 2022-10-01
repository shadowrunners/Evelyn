const { Schema, model } = require("mongoose");

module.exports = model(
  "XP",
  new Schema({
    id: String,
    user: String,
    XP: Number,
    level: Number,
    closed: Boolean,
    closer: String,
    creatorId: String,
  })
);
