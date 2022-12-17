const { webhookDelivery } = require("../../functions/webhookDelivery.js");
const DB = require("../../structures/schemas/guild.js");
const { Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageDelete",
  /**
   * @param {Message} message
   */
  async execute(message) {
    const { guild, author, content, createdTimestamp } = message;

    const data = await DB.findOne({
      id: guild.id,
    });

    if (
      !data ||
      !data.logs.enabled ||
      !data.logs.channel ||
      !data.logs.webhook ||
      author.bot
    )
      return;

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    return webhookDelivery(
      data,
      embed
        .setAuthor({
          name: guild.name,
          iconURL: guild.iconURL(),
        })
        .setTitle("Message Deleted")
        .addFields([
          {
            name: "🔹 | Message Content",
            value: `> ${content}`,
            inline: true,
          },
          {
            name: "🔹 | ID",
            value: `> ${message.id}`,
            inline: true,
          },
          {
            name: "🔹 | Message sent by",
            value: `> ${author}`,
            inline: true,
          },
          {
            name: "🔹 | Deleted at",
            value: `> <t:${parseInt(createdTimestamp / 1000)}:R>`,
            inline: true,
          },
        ])
    );
  },
};
