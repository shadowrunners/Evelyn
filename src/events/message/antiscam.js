const { Message, MessageEmbed } = require("discord.js");
const config = require("../../structures/config.json");
const DB = require("../../structures/schemas/guildDB.js");

module.exports = {
  name: "messageCreate",
  /**
   * @param {Message} message
   */
  async execute(message) {
    const data = await DB.findOne({ id: message.guild.id });

    if (!message.guild) return;
    if (data.antiscam.enabled == false || data.antiscam.channel == null) return;

    const array = require(`../../structures/handlers/validation/scamLinks.json`);
    if (array.some((word) => message.content.toLowerCase().includes(word))) {
      message.delete();
      const Embed = new MessageEmbed()
        .setTitle("Aeolian | Scam Detected")
        .setColor("GREY")
        .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
        .setDescription(
          `A potentially fraudulent message was detected, logged and deleted.`
        )
        .addFields(
          {
            name: "User",
            value: `\`\`\`${message.author.tag} (${message.author.id})\`\`\``,
          },
          { name: "Message Content", value: `\`\`\`${message.content}\`\`\`` }
        )
        .setTimestamp();

      await message.guild.channels.cache
        .get(data.antiscam.channel)
        .send({ embeds: [Embed] });
    }
  },
};
