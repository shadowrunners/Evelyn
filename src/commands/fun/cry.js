const { CommandInteraction, EmbedBuilder } = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "cry",
  description: "Do you need a tissue?",
  public: true,
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { body } = await superagent.get("https://api.waifu.pics/sfw/cry");

    const cryEmbed = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({
        name: `${interaction.user.username} is crying.. :c`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setImage(body.url)
      .setTimestamp();

    interaction.reply({ embeds: [cryEmbed] });
  },
};
