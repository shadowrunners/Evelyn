const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const superagent = require("superagent");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tweet")
    .setDescription("Tweet something about someone.")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Provide the text for the comment.")
        .setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const text = interaction.options.getString("text");

    superagent
      .get(
        `https://nekobot.xyz/api/imagegen?type=tweet&username=${interaction.user.username}&text=${text}`
      )
      .then(function (res) {
        const tweetEmbed = new EmbedBuilder()
          .setColor("Grey")
          .setImage(res.body.message)
          .setTimestamp();
        return interaction.reply({ embeds: [tweetEmbed] });
      });
  },
};
