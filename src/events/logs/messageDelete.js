const { Client, Message, EmbedBuilder, AuditLogEvent } = require("discord.js");
const DB = require("../../structures/schemas/guildDB.js");

module.exports = {
  name: "messageDelete",
  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    const data = await DB.findOne({
      id: message.guild.id,
    });

    if (!data) return;
    if (message.author.bot) return;

    const allLogs = await message.guild.fetchAuditLogs({
      type: AuditLogEvent.MessageDelete,
      limit: 1,
    });
    const fetchLogs = allLogs.entries.first();

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setTitle("Message Deleted")
      .addFields(
        {
          name: "🔹 | Message sent by",
          value: `> <@${message.author.id}>`,
        },
        {
          name: "🔹 | Message deleted by",
          value: `> <@${fetchLogs.executor.id}>`,
        },
        {
          name: "🔹 | Message located in",
          value: `> <#${message.channel.id}>`,
        },
        {
          name: "🔹 | Message Content",
          value: `> ${message.content}` || "No content.",
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
