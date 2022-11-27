const { Client, Message } = require("discord.js");
const DXP = require("discord-xp");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "messageCreate",
  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    const { author, guild } = message;
    const data = await DB.findOne({ id: guild.id });

    if (!guild || author.bot) return;
    if (data.levels.enabled === false || data.levels.channel === "") return;

    const levellingChannel = client.channels.cache.get(data.levels?.channel);
    if (!levellingChannel) return;

    const rndXP = Number(Math.floor(Math.random() * 25));
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

      if (levellingChannel)
        return levellingChannel.send({ content: `${lvlMessage}` });
    }
  },
};
