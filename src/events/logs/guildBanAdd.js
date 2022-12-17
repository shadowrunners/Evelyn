const { webhookDelivery } = require("../../functions/webhookDelivery.js");
const { GuildMember, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "guildBanAdd",
  /**
   * @param {GuildMember} member
   */
  async execute(member) {
    const { guild, user } = member;

    const data = await DB.findOne({
      id: guild.id,
    });

    if (!data || !data.logs.enabled || !data.logs.channel || !data.logs.webhook)
      return;

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    return webhookDelivery(
      data,
      embed
        .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
        .setTitle("Member Banned")
        .addFields(
          {
            name: "🔹 | Member Name",
            value: `> ${user.username}`,
            inline: true,
          },
          {
            name: "🔹 | ID",
            value: `> ${user.id}`,
            inline: true,
          }
        )
    );
  },
};
