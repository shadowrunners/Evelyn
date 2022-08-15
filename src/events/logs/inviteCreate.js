const { Client, Invite, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/guildDB.js");

module.exports = {
  name: "inviteCreate",
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

    const embed = new EmbedBuilder()
      .setAuthor({
        name: invite.guild.name,
        iconURL: invite.guild.iconURL({ dynamic: true }),
      })
      .setTitle("Invite Created")
      .addFields(
        {
          name: "🔹 | Invite Link",
          value: `> ${invite.code}`,
        },
        {
          name: "🔹 | Invite created at",
          value: `> <t:${parseInt(invite.createdTimestamp / 1000)}:R>`,
        },
        {
          name: "🔹 | Invite expires at",
          value: `> <t:${parseInt(invite.expiresTimestamp / 1000)}:R>`,
        },
        {
          name: "🔹 | Invite created by",
          value: `> <@${invite.inviter.id}>`,
        },
        {
          name: "🔹 | Max Uses",
          value: `> ${invite.maxUses.toString()}`,
        }
      )
      .setFooter({
        text: invite.inviter.tag,
        iconURL: invite.inviter.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();
    return client.channels.cache
      .get(data.logs.channel)
      .send({ embeds: [embed] });
  },
};
