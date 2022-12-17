const { webhookDelivery } = require("../../functions/webhookDelivery.js");
const { GuildChannel, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "channelCreate",
  /**
   * @param {GuildChannel} channel
   */
  async execute(channel) {
    const { guild, name, id, createdTimestamp } = channel;

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
          iconURL: guild.iconURL(),
        })
        .setTitle("Channel Created")
        .addFields(
          {
            name: "🔹 | Channel Name",
            value: `> ${name}`,
            inline: true,
          },
          {
            name: "🔹 | ID",
            value: `> ${id}`,
            inline: true,
          },
          {
            name: "🔹 | Created at",
            value: `> <t:${parseInt(createdTimestamp / 1000)}:R>`,
            inline: true,
          }
        )
    );
  },
};
