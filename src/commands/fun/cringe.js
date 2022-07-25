const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const superagent = require("superagent");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cringe")
    .setDescription("That's pretty cringe."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { body } = await superagent.get("https://api.waifu.pics/sfw/cringe");

    const prettyCringe = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({
        name: `${interaction.user.username} thinks that's pretty cringe.`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setImage(body.url)
      .setTimestamp();
    interaction.reply({ embeds: [prettyCringe] });
  },
};
