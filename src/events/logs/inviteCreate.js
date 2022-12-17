const { webhookDelivery } = require("../../functions/webhookDelivery.js");
const DB = require("../../structures/schemas/guild.js");
const { Invite, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "inviteCreate",
  /**
   * @param {Invite} invite
   */
  async execute(invite) {
    const {
      guild,
      code,
      createdTimestamp,
      inviter,
      maxUses,
      expiresTimestamp,
    } = invite;

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
        .setTitle("Invite Created")
        .addFields(
          {
            name: "🔹 | Invite Link",
            value: `> ${code}`,
            inline: true,
          },
          {
            name: "🔹 | Invite created at",
            value: `> <t:${parseInt(createdTimestamp / 1000)}:R>`,
            inline: true,
          },
          {
            name: "🔹 | Invite expires at",
            value: `> <t:${parseInt(expiresTimestamp / 1000)}:R>`,
            inline: true,
          },
          {
            name: "🔹 | Invite created by",
            value: `> <@${inviter.id}>`,
            inline: true,
          },
          {
            name: "🔹 | Max Uses",
            value: `> ${maxUses.toString()}`,
            inline: true,
          }
        )
        .setFooter({
          text: inviter.tag,
          iconURL: inviter.displayAvatarURL({ dynamic: true }),
        })
    );
  },
};
