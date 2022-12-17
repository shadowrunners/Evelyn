const { webhookDelivery } = require("../../functions/webhookDelivery.js");
const { GuildMember, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {GuildMember} member
   */
  async execute(member) {
    const { guild, user } = member;

    const data = await DB.findOne({
      id: guild.id,
    });

    if (
      !data ||
      !data.logs.enabled ||
      !data.logs.channel ||
      !data.logs.webhook ||
      user.bot
    )
      return;

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    return webhookDelivery(
      data,
      embed
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle("Member Joined")
        .addFields(
          {
            name: "🔹 | Member Name",
            value: `> ${user.tag}`,
            inline: true,
          },
          {
            name: "🔹 | Member ID",
            value: `> ${user.id}`,
            inline: true,
          },
          {
            name: "🔹 | Account Age",
            value: `> <t:${parseInt(user.createdTimestamp / 1000)}:R>`,
            inline: true,
          }
        )
        .setFooter({ text: `${guild.name}` })
    );
  },
};
