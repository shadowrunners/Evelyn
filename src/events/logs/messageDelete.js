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
    if (data.logs.enabled === false || data.logs.channel === null) return;
    if (message.author.bot) return;

    console.log(message);

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setTitle("Message Deleted")
      .addFields(
        {
          name: "🔹 | Message sent by",
          value: `> <@${message.author.id}>`,
          inline: true,
        },
        {
          name: "🔹 | Message located in",
          value: `> <#${message.channel.id}>`,
          inline: true,
        },
        {
          name: "🔹 | Message Content",
          value: `> ${message.content}` || "No content.",
          inline: true,
        }
      )
      .setTimestamp();
    client.channels.cache.get(data.logs.channel).send({ embeds: [embed] });
  },
};
