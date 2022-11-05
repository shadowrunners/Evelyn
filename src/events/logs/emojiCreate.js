const {
  Client,
  GuildEmoji,
  EmbedBuilder,
  AuditLogEvent,
} = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "emojiCreate",
  /**
   * @param {GuildEmoji} emoji
   * @param {Client} client
   */
  async execute(emoji, client) {
    const data = await DB.findOne({
      id: emoji.guild.id,
    });

    if (!data) return;
    if (data.logs.enabled === false || data.logs.channel === null) return;

    const logs = await emoji.guild.fetchAuditLogs({
      type: AuditLogEvent.EmojiCreate,
      limit: 1,
    });
    const fetchLogs = logs.entries.first();

    const animatedStatus = fetchLogs.target.animated ? "Yes." : "No.";

    const embed = new EmbedBuilder()
      .setAuthor({ name: emoji.guild.name, iconURL: emoji.guild.iconURL() })
      .setTitle("Emoji Created")
      .addFields(
        {
          name: "🔹 | Emoji Added",
          value: `> <:${emoji.name}:${emoji.id}>`,
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
    return client.channels.cache
      .get(data.logs.channel)
      .send({ embeds: [embed] });
  },
};
