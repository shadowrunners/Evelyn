const { webhookDelivery } = require("../../functions/webhookDelivery.js");
const { GuildEmoji, EmbedBuilder, AuditLogEvent } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");
const { EmojiCreate } = AuditLogEvent;

module.exports = {
  name: "emojiCreate",
  /**
   * @param {GuildEmoji} emoji
   */
  async execute(emoji) {
    const { guild, name, id } = emoji;

    const data = await DB.findOne({
      id: guild.id,
    });

    if (!data.logs.enabled || !data.logs.webhook) return;

    const fetchLogs = await guild.fetchAuditLogs({
      type: EmojiCreate,
      limit: 1,
    });
    const firstLog = fetchLogs.entries.first();

    const embed = new EmbedBuilder().setColor("Blurple")

    return webhookDelivery(
      data,
      embed
        .setAuthor({
          name: guild.name,
          iconURL: guild.iconURL()
        })
        .setTitle("Emoji Created")
        .addFields(
          {
            name: "🔹 | Name",
            value: `> ${name}`,
          },
          {
            name: "🔹 | ID",
            value: `> ${id}`,
          },
          {
            name: "🔹 | Added by",
            value: `> <@${firstLog.executor.id}>`,
          },
        ),
    );
  },
};
