const { CommandInteraction, EmbedBuilder } = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "cringe",
  description: "That's pretty cringe.",
  public: true,
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { body } = await superagent.get("https://api.waifu.pics/sfw/cringe");
    
    const prettyCringe = new EmbedBuilder()
      .setColor("BLURPLE")
      .setAuthor({
        name: `${interaction.user.username} thinks that's pretty cringe.`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setImage(body.url)
      .setTimestamp();
    interaction.reply({ embeds: [prettyCringe] });
  },
};
