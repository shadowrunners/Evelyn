const {
  Client,
  GuildChannel,
  EmbedBuilder,
  AuditLogEvent,
} = require("discord.js");
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

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    const allLogs = await channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelDelete,
    });
    const fetchLogs = allLogs.entries.first();

    return client.channels.cache.get(data.logs.channel).send({
      embeds: [
        embed
          .setAuthor({
            name: channel.guild.name,
            iconURL: channel.guild.iconURL(),
          })
          .setTitle("Channel Deleted")
          .addFields([
            {
              name: "🔹 | Channel Name",
              value: `> ${channel.name}`,
            },
            {
              name: "🔹 | Channel ID",
              value: `> ${channel.id}`,
            },
            {
              name: "🔹 | Deleted by",
              value: `> <@${fetchLogs.executor.id}>`,
            },
          ]),
      ],
    });
  },
};
