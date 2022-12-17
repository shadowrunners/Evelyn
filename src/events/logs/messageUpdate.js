const { webhookDelivery } = require("../../functions/webhookDelivery.js");
const DB = require("../../structures/schemas/guild.js");
const { Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageUpdate",
  /**
   * @param {Message} oldMessage
   * @param {Message} newMessage
   */
  async execute(oldMessage, newMessage) {
    const data = await DB.findOne({
      id: oldMessage.guild.id,
    });

    if (
      !data ||
      !data.logs.enabled ||
      !data.logs.channel ||
      !data.logs.webhook ||
      oldMessage.author.bot
    )
      return;

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    if (oldMessage.content !== newMessage.content)
      return webhookDelivery(
        data,
        embed
          .setAuthor({
            name: oldMessage.guild.name,
            iconURL: oldMessage.guild.iconURL(),
          })
          .setTitle("Message Updated")
          .addFields(
            {
              name: "🔹 | Old Content",
              value: `> ${oldMessage.content}`,
              inline: true,
            },
            {
              name: "🔹 | New Content",
              value: `> ${newMessage.content}`,
              inline: true,
            },
            {
              name: "🔹 | ID",
              value: `> ${oldMessage.id}`,
              inline: true,
            },
            {
              name: "🔹 | Message updated by",
              value: `> ${newMessage.author}`,
              inline: true,
            },
            {
              name: "🔹 | Updated at",
              value: `> <t:${parseInt(newMessage.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: "🔹 | Wanna see the message?",
              value: `> [Jump to Message](${newMessage.url})`,
              inline: true,
            }
          )
      );
  },
};
