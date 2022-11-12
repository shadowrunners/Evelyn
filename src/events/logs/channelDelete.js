const { Client, GuildChannel, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "channelDelete",
  /**
   * @param {GuildChannel} channel
   * @param {Client} client
   */
  async execute(channel, client) {
    const data = await DB.findOne({
      id: channel.guild.id,
    });

    if (!data) return;
    if (data.logs.enabled === false || data.logs.channel === null) return;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({
        name: channel.guild.name,
        iconURL: channel.guild.iconURL(),
      })
      .setTitle("Channel Deleted")
      .addFields([
        {
          name: "🔹 | Channel Name",
          value: `> ${channel.name}`,
          inline: true,
        },
        {
          name: "🔹 | Channel ID",
          value: `> ${channel.id}`,
          inline: true,
        },
        {
          name: "🔹 | Deleted at",
          value: `> <t:${parseInt(channel.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
      ])
      .setTimestamp();

    return client.channels.cache
      .get(data.logs.channel)
      .send({ embeds: [embed] });
  },
};
