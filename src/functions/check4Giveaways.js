const DB = require("../structures/schemas/giveaway.js");
const { endGiveaway } = require("./giveawayUtils.js");

async function check4Giveaways(client) {
  DB.find().then((data) => {
    data.forEach(async (data) => {
      if (!data) return;

      const guild = client.guilds.cache.get(data.guildId);
      if (!guild) return;

      if (data.hasEnded === true) return;
      if (data.isPaused === true) return;

      const message = await guild.channels?.cache
        .get(data?.channelId)
        ?.messages.fetch(data.messageId);
      if (!message) return;

      if (data.endTime * 1000 < Date.now()) endGiveaway(message);
      else
        setTimeout(
          () => endGiveaway(message),
          data.endTime * 1000 - Date.now()
        );
    });
  });
}

module.exports = { check4Giveaways };
