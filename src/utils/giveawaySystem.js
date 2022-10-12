const { Client } = require("discord.js");
const DB = require("../structures/schemas/giveaway.js");
const { endGiveaway } = require("./giveawayFunctions.js");

/**
 * @param {Client} client
 */

module.exports = (client) => {
  DB.find().then((schemaArray) => {
    schemaArray.forEach( (data) => {
      if (!data) return;
      if (data.hasEnded === true) return;
      if (data.isPaused === true) return;

      const guild = client.guilds.cache.get(data.GuildID);
      if (!guild) return;

      const message = guild.channels.cache
        .get(data.channel)
        ?.messages.fetch(data.messageID);
      if (!message) return;

      if (data.endTime * 1000 < Date.now()) endGiveaway(message);
      else
        setTimeout(
          () => endGiveaway(message),
          data.endTime * 1000 - Date.now()
        );
    });
  });
};
