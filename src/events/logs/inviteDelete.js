const { webhookDelivery } = require("../../functions/webhookDelivery.js");
const DB = require("../../structures/schemas/guild.js");
const { Invite, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "inviteDelete",
  /**
   * @param {Invite} invite
   */
  async execute(invite) {
    const { guild, code } = invite;

    const data = await DB.findOne({
      id: invite.guild.id,
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
        .setTitle("Invite Deleted")
        .addFields({
          name: "🔹 | Invite Link",
          value: `> ${code}`,
        })
        .setTimestamp()
    );
  },
};
