const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const { nekoFetch } = require("../../structures/functions/nekoFetch.js");

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
    const action = "tweet";
    const member = interaction.user.username;
    const text = interaction.options.getString("text");

    const data = await nekoFetch(action, member, text);
    const tweetEmbed = new EmbedBuilder()
      .setColor("Grey")
      .setImage(data)
      .setTimestamp();
    return interaction.reply({ embeds: [tweetEmbed] });
  },
};
