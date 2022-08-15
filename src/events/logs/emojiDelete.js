const {
  Client,
  GuildEmoji,
  EmbedBuilder,
  AuditLogEvent,
} = require("discord.js");
const DB = require("../../structures/schemas/guildDB.js");

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
    if (data.logs.enabled == "false" || data.logs.channel == null) return;

    console.log(emoji);

    const allLogs = await emoji.guild.fetchAuditLogs({
      type: AuditLogEvent.EmojiDelete,
      limit: 1,
    });
    const fetchLogs = allLogs.entries.first();

    const animatedStatus = fetchLogs.target.animated ? "Yes." : "No.";

    const embed = new EmbedBuilder()
      .setAuthor({ name: emoji.guild.name, iconURL: emoji.guild.iconURL() })
      .setTitle("Emoji Deleted")
      .addFields(
        {
          name: "🔹 | Emoji Removed",
          value: `> <:${emoji.name}:${emoji.id}>`,
        },
        {
          name: "🔹 | Animated?",
          value: `> ${animatedStatus}`,
        },
        {
          name: "🔹 | Removed by",
          value: `> <@${fetchLogs.executor.id}>`,
        }
      )
      .setFooter({
        text: fetchLogs.executor.tag,
        iconURL: fetchLogs.executor.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();
    return client.channels.cache
      .get(data.logs.channel)
      .send({ embeds: [embed] });
  },
};
