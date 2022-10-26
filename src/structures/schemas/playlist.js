const { model, Schema } = require("mongoose");

module.exports = model(
  "Playlists",
  new Schema({
    playlistName: String,
    playlistData: Array,
    name: String,
    userID: String,
    created: Number,
  })
);
