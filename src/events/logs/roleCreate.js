const { Client, Role, EmbedBuilder, AuditLogEvent } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "roleCreate",
  /**
   * @param {Role} role
   * @param {Client} client
   */
  async execute(role, client) {
    const data = await DB.findOne({
      id: role.guild.id,
    });

    if (!data) return;
    if (data.logs.enabled === false || data.logs.channel === null) return;

    const allLogs = await role.guild.fetchAuditLogs({
      type: AuditLogEvent.RoleCreate,
      limit: 1,
    });
    const fetchAuditLogs = allLogs.entries.first();

    const embed = new EmbedBuilder()
      .setAuthor({
        name: role.guild.name,
        iconURL: role.guild.iconURL({ dynamic: true }),
      })
      .setTitle("Role Created")
      .addFields(
        {
          name: "🔹 | Role Name",
          value: `> ${fetchAuditLogs.target.name}`,
        },
        {
          name: "🔹 | Role Color",
          value: `> ${fetchAuditLogs.target.hexColor}`,
        },
        {
          name: "🔹 | Role ID",
          value: `> ${fetchAuditLogs.target.id}`,
        },
        {
          name: "🔹 | Role created at",
          value: `> <t:${parseInt(
            fetchAuditLogs.target.createdTimestamp / 1000
          )}:R>`,
        },
        {
          name: "🔹 | Role created by",
          value: `> <@${fetchAuditLogs.executor.id}>`,
        }
      )
      .setFooter({
        text: fetchAuditLogs.executor.tag,
        iconURL: fetchAuditLogs.executor.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();
    return client.channels.cache
      .get(data.logs.channel)
      .send({ embeds: [embed] });
  },
};
