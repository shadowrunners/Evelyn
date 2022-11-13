const { Client, Role, EmbedBuilder } = require("discord.js");
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
    if (data.logs.enabled === false || data.logs.channel === "") return;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({ name: role.guild.name, iconURL: role.guild.iconURL() })
      .setTitle("Role Deleted")
      .addFields(
        {
          name: "🔹 | Role Name",
          value: `> ${role.name}`,
        },
        {
          name: "🔹 | Role ID",
          value: `> ${role.id}`,
        }
      )
      .setTimestamp();

    return client.channels.cache
      .get(data.logs?.channel)
      .send({ embeds: [embed] });
  },
};
