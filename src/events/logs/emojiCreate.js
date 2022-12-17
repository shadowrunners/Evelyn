const { webhookDelivery } = require("../../functions/webhookDelivery.js");
const { GuildEmoji, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "emojiCreate",
  /**
   * @param {GuildEmoji} emoji
   */
  async execute(emoji) {
    const { guild, name, id } = emoji;

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
        .setTitle("Emoji Created")
        .addFields(
          {
            name: "🔹 | Name",
            value: `> ${name}`,
            inline: true,
          },
          {
            name: "🔹 | ID",
            value: `> ${id}`,
            inline: true,
          }
        )
    );
  },
};
