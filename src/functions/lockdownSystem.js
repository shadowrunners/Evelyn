const { Client } = require("discord.js");
const DB = require("../structures/schemas/lockdown.js");

module.exports = {
  /**
   * @param {Client} client
   */
  check4Lockdowns: async (client) => {
    DB.find().then(async (data) => {
      data.forEach(async (data) => {
        const channel = client.guilds.cache
          .get(data.guildId)
          .channels.cache.get(data.channelId);
        if (!channel) return;

        if (data.timeLocked < Date.now()) {
          await DB.deleteOne({ channelId: channel.id });

          return channel.permissionOverwrites.edit(data.guildId, {
            SendMessages: null,
          });
        }

        setTimeout(async () => {
          await DB.deleteOne({ ChannelID: channel.id });

          return channel.permissionOverwrites.edit(data.guildId, {
            SendMessages: null,
          });
        }, data.timeLocked - Date.now());
      });
    });
  },
};
