const { webhookDelivery } = require("../../functions/webhookDelivery.js");
const DB = require("../../structures/schemas/guild.js");
const { Role, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "roleDelete",
  /**
   * @param {Role} role
   */
  async execute(role) {
    const { guild, name, id } = role;
    const data = await DB.findOne({ id: guild.id });

    if (!data || !data.logs.enabled || !data.logs.channel || !data.logs.webhook)
      return;

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    return webhookDelivery(
      data,
      embed
        .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
        .setTitle("Role Deleted")
        .addFields(
          {
            name: "🔹 | Role Name",
            value: `> ${name}`,
          },
          {
            name: "🔹 | Role ID",
            value: `> ${id}`,
          }
        )
    );
  },
};
