const { Client, GuildEmoji, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "emojiDelete",
  /**
   * @param {GuildEmoji} emoji
   * @param {Client} client
   */
  async execute(emoji, client) {
    const data = await DB.findOne({
      id: emoji.guild.id,
    });

    if (!data) return;
    if (data.logs.enabled === false || data.logs.channel === "") return;

    const logsChannel = client.channels.cache.get(data.logs?.channel);
    if (!logsChannel) return;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({ name: emoji.guild.name, iconURL: emoji.guild.iconURL() })
      .setTitle("Emoji Deleted")
      .addFields(
        {
          name: "🔹 | Name",
          value: `> ${emoji.name}`,
          inline: true,
        },
        {
          name: "🔹 | ID",
          value: `> ${emoji.id}`,
          inline: true,
        }
      )
      .setTimestamp();
    return logsChannel.send({ embeds: [embed] });
  },
};
