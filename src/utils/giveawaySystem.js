const { Client } = require("discord.js");
const DB = require("../structures/schemas/giveaway.js");
const { endGiveaway } = require("./giveawayFunctions.js");

/**
 * @param {Client} client
 */

module.exports = (client) => {
  DB.find().then((schemaArray) => {
    schemaArray.forEach(async (data) => {
      if (!data) return;
      if (data.Ended === true) return;
      if (data.Paused === true) return;
      const message = await client.guilds.cache
        .get(data.GuildID)
        .channels.cache.get(data.ChannelID)
        .messages.fetch(data.MessageID);
      if (!message) return;

      const expireDate = data.EndTime * 1000 - Date.now();

      if (data.EndTime * 1000 < Date.now()) endGiveaway(message);
      else setTimeout(() => endGiveaway(message), expireDate);
    });
  });
};
