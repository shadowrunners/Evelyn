const {
  Client,
  GuildChannel,
  EmbedBuilder,
  AuditLogEvent,
} = require("discord.js");
const DB = require("../../structures/schemas/guildDB.js");

module.exports = {
  name: "emojiCreate",
  /**
   * @param {GuildChannel} channel
   * @param {Client} client
   */
  async execute(channel, client) {
    const data = await DB.findOne({
      id: channel.guild.id,
    });

    if (!data) return;
    if (data.logs.enabled == "false" || data.logs.channel == null) return;

    const allLogs = await channel.guild.fetchAuditLogs({
      type: AuditLogEvent.EmojiCreate,
      limit: 1,
    });
    const fetchLogs = allLogs.entries.first();

    const animatedStatus = fetchLogs.target.animated ? "Yes." : "No.";

    const embed = new EmbedBuilder()
      .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL() })
      .setTitle("Emoji Created")
      .addFields(
        {
          name: "🔹 | Emoji Added",
          value: `> <:${fetchLogs.id}:${fetchLogs.target.id}>`,
        },
        {
          name: "🔹 | Animated?",
          value: `> ${animatedStatus}`,
        },
        {
          name: "🔹 | Added by",
          value: `> <@${fetchLogs.executor.id}> (${fetchLogs.executor.id})`,
        }
      )
      .setTimestamp();
    client.channels.cache.get(data.logs.channel).send({ embeds: [embed] });
  },
};
