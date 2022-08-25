const { Client, Invite, EmbedBuilder, AuditLogEvent } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "inviteDelete",
  /**
   * @param {Invite} invite
   * @param {Client} client
   */
  async execute(invite, client) {
    const data = await DB.findOne({
      id: invite.guild.id,
    });

    if (!data) return;
    if (data.logs.enabled == "false" || data.logs.channel == null) return;

    const allLogs = await invite.guild.fetchAuditLogs({
      type: AuditLogEvent.InviteDelete,
      limit: 1,
    });
    const fetchLogs = allLogs.entries.first();

    const embed = new EmbedBuilder()
      .setAuthor({
        name: invite.guild.name,
        iconURL: invite.guild.iconURL({ dynamic: true }),
      })
      .setTitle("Invite Deleted")
      .addFields(
        {
          name: "🔹 | Invite Link",
          value: `> ${invite.code}`,
        },
        {
          name: "🔹 | Invite deleted by",
          value: `> <@${fetchLogs.executor.id}> (${fetchLogs.executor.id})`,
        }
      )
      .setTimestamp();
    return client.channels.cache
      .get(data.logs.channel)
      .send({ embeds: [embed] });
  },
};
