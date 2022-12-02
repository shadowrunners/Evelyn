const { Client, Message, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "messageUpdate",
  /**
   * @param {Message} oldMessage
   * @param {Message} newMessage
   * @param {Client} client
   */
  async execute(oldMessage, newMessage, client) {
    const data = await DB.findOne({
      id: oldMessage.guild.id,
    });

    if (!data) return;
    if (data.logs.enabled === false || data.logs.channel === "") return;

    const logsChannel = client.channels.cache.get(data.logs?.channel);
    if (!logsChannel) return;

    if (oldMessage.author.bot) return;

    if (oldMessage.content !== newMessage.content) {
      const embed = new EmbedBuilder()
        .setColor("Blurple")
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
        .setTimestamp();
      return logsChannel.send({ embeds: [embed] });
    }
  },
};
