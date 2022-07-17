const { model, Schema } = require("mongoose");

module.exports = model(
  "TicketDB",
  new Schema({
    GuildID: String,
    MembersID: [String],
    TicketID: String,
    ChannelID: String,
    Closed: Boolean,
    Locked: Boolean,
    Type: String,
    Claimed: Boolean,
    ClaimedBy: String,
    OpenTime: String,
  })
);
