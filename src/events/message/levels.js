const { Client, Message } = require("discord.js");
const DXP = require("discord-xp");
const guildDB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "messageCreate",
  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    try {
      const { author, guild } = message;
      const data = await guildDB.findOne({ id: guild.id });

      if (!guild || author.bot) return;
      if (data.levels.enabled === false) return;

      const rndXP = Math.floor(Math.random() * 25) * 1;
      const levelledUp = await DXP.appendXp(
        message.author.id,
        message.guild.id,
        rndXP
      );

      if (levelledUp) {
        const user = await DXP.fetch(message.author.id, message.guild.id);

        const lvlMessage = data.levels?.message
          ?.replace(/{userTag}/g, `${message.author.name}`)
          .replace(/{userName}/g, `${message.author.username}`)
          .replace(/{userMention}/g, `<@${message.author.id}>`)
          .replace(/{userLevel}/g, `${user.level}`);

        if (data.levels.channel) {
          client.channels.cache
            .get(data.levels.channel)
            .send({ content: `${lvlMessage}` });
        }
      }
    } catch (_err) {}
  },
};
