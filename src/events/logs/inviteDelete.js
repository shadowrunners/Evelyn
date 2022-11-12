const { Client, Invite, EmbedBuilder } = require("discord.js");
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
    if (data.logs.enabled === false || data.logs.channel === null) return;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({
        name: invite.guild.name,
        iconURL: invite.guild.iconURL({ dynamic: true }),
      })
      .setTitle("Invite Deleted")
      .addFields({
        name: "🔹 | Invite Link",
        value: `> ${invite.code}`,
      })
      .setTimestamp();

    return client.channels.cache
      .get(data.logs?.channel)
      .send({ embeds: [embed] });
  },
};
