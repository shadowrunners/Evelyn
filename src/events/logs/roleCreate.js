const { webhookDelivery } = require("../../functions/webhookDelivery.js");
const DB = require("../../structures/schemas/guild.js");
const { Role, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "roleCreate",
  /**
   * @param {Role} role
   */
  async execute(role) {
    const { guild, name, hexColor, id, createdTimestamp } = role;

    const data = await DB.findOne({
      id: guild.id,
    });

    if (!data || !data.logs.enabled || !data.logs.channel || !data.logs.webhook)
      return;

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    return webhookDelivery(
      data,
      embed
        .setAuthor({
          name: guild.name,
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setTitle("Role Created")
        .addFields(
          {
            name: "🔹 | Role Name",
            value: `> ${name}`,
          },
          {
            name: "🔹 | Role Color",
            value: `> ${hexColor}`,
          },
          {
            name: "🔹 | Role ID",
            value: `> ${id}`,
          },
          {
            name: "🔹 | Role created at",
            value: `> <t:${parseInt(createdTimestamp / 1000)}:R>`,
          }
        )
    );
  },
};
