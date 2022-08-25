const { Client, Role, EmbedBuilder, AuditLogEvent } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "roleDelete",
  /**
   * @param {Role} role
   * @param {Client} client
   */
  async execute(role, client) {
    const data = await DB.findOne({ id: role.guild.id });

    if (!data) return;
    if (data.logs.enabled == "false" || data.logs.channel == null) return;

    const allLogs = await role.guild.fetchAuditLogs({
      type: AuditLogEvent.RoleDelete,
      limit: 1,
    });
    const fetchLogs = allLogs.entries.first();

    const embed = new EmbedBuilder()
      .setAuthor({ name: role.guild.name, iconURL: role.guild.iconURL() })
      .setTitle("Role Deleted")
      .addFields(
        {
          name: "🔹 | Role Name",
          value: `> ${fetchLogs.changes[0].old}`,
        },
        {
          name: "🔹 | Role ID",
          value: `> ${fetchLogs.id}`,
        },
        {
          name: "🔹 | Role deleted by",
          value: `> <@${fetchLogs.executor.id}>`,
        }
      )
      .setFooter({
        text: fetchLogs.executor.tag,
        iconURL: fetchLogs.executor.displayAvatarURL(),
      })
      .setTimestamp();
    return client.channels.cache
      .get(data.logs.channel)
      .send({ embeds: [embed] });
  },
};
