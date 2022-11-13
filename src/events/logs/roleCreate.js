const { Client, Role, EmbedBuilder } = require("discord.js");
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
    if (data.logs.enabled === false || data.logs.channel === "") return;

    const logsChannel = client.channels.cache.get(data.logs?.channel);
    if (!logsChannel) return;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({
        name: role.guild.name,
        iconURL: role.guild.iconURL({ dynamic: true }),
      })
      .setTitle("Role Created")
      .addFields(
        {
          name: "🔹 | Role Name",
          value: `> ${role.name}`,
        },
        {
          name: "🔹 | Role Color",
          value: `> ${role.hexColor}`,
        },
        {
          name: "🔹 | Role ID",
          value: `> ${role.id}`,
        },
        {
          name: "🔹 | Role created at",
          value: `> <t:${parseInt(role.createdTimestamp / 1000)}:R>`,
        }
      )
      .setTimestamp();
    return logsChannel.send({ embeds: [embed] });
  },
};
