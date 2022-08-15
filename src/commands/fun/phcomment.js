const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const { nekoFetch } = require("../../utils/nekoFetch.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("phcomment")
    .setDescription("Write a spicy PH comment on your behalf.")
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
    const action = "phcomment";
    const member = interaction.user.username;
    const text = interaction.options.getString("text");

    const data = await nekoFetch(action, member, text);
    const phEmbed = new EmbedBuilder()
      .setColor("Grey")
      .setImage(data)
      .setTimestamp();
    return interaction.reply({ embeds: [phEmbed] });
  },
};
