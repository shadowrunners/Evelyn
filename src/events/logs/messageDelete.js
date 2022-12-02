const { Client, Message, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "messageDelete",
  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    const data = await DB.findOne({
      id: message.guild.id,
    });

    if (!data) return;
    if (data.logs.enabled === false || data.logs.channel === "") return;

    const logsChannel = client.channels.cache.get(data.logs?.channel);
    if (!logsChannel) return;

    if (message.author.bot) return;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL(),
      })
      .setTitle("Message Deleted")
      .addFields([
        {
          name: "🔹 | Message Content",
          value: `> ${message.content}`,
          inline: true,
        },
        {
          name: "🔹 | ID",
          value: `> ${message.id}`,
          inline: true,
        },
        {
          name: "🔹 | Message sent by",
          value: `> ${message.author}`,
          inline: true,
        },
        {
          name: "🔹 | Deleted at",
          value: `> <t:${parseInt(message.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
      ])
      .setTimestamp();
    return logsChannel.send({ embeds: [embed] });
  },
};
