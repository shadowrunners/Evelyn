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
    if (data.logs.enabled === false || data.logs.channel === null) return;
    if (oldMessage.author.bot) return;

    let oldShortened;
    let newShortened;

    const oldContent = oldMessage.content;
    const newContent = newMessage.content;

    if (oldContent.length > 1024) oldShortened = oldContent.slice(0, 1024);
    if (newContent.length > 1024) newShortened = newContent.slice(0, 1024);

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({
        name: oldMessage.guild.name,
        iconURL: oldMessage.guild.iconURL({ dynamic: true }),
      })
      .setTitle("Message Updated")
      .addFields(
        {
          name: "🔹 | Message updated by",
          value: `> ${newMessage.author.toString()}`,
          inline: true,
        },
        {
          name: "🔹 | Message located in",
          value: `> <#${newMessage.channel.id}>`,
          inline: true,
        },
        {
          name: "🔹 | Old Content",
          value: `> ${oldMessage.content}` || "No content.",
        },
        {
          name: "🔹 | New Content",
          value: `> ${oldMessage.content}` || "No content.",
          inline: true,
        }
      )
      .setTimestamp();

    return client.channels.cache
      .get(data.logs.channel)
      .send({ embeds: [embed] });
  },
};
