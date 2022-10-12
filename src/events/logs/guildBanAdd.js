const {
  Client,
  GuildChannel,
  EmbedBuilder,
  AuditLogEvent,
} = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "guildBanAdd",
  /**
   * @param {GuildChannel} channel
   * @param {Client} client
   */
  async execute(channel, client) {
    const data = await DB.findOne({
      id: channel.guild.id,
    });

    if (!data) return;
    if (data.logs.enabled == "false" || data.logs.channel === null) return;

    const allLogs = await channel.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberBanAdd,
      limit: 1,
    });
    const fetchLogs = allLogs.entries.first();

    const embed = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL() })
      .setTitle("Member Banned")
      .addFields([
        {
          name: "🔹 | Member Name",
          value: `> ${fetchLogs.target.username}#${fetchLogs.target.discriminator} (${fetchLogs.target.id})`,
        },
        {
          name: "🔹 | Reason",
          value: `> ${fetchLogs.reason}` || "Not provided.",
        },
        {
          name: "🔹 | Banned by",
          value: `> <@${fetchLogs.executor.id}> (${fetchLogs.executor.id})`,
        },
      ])
      .setTimestamp();
    return client.channels.cache
      .get(data.logs.channel)
      .send({ embeds: [embed] });
  },
};
