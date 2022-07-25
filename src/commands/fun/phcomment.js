const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const superagent = require("superagent");

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
    const text = interaction.options.getString("text");

    superagent
      .get(
        `https://nekobot.xyz/api/imagegen?type=phcomment&username=${
          interaction.user.username
        }&image=${interaction.user.avatarURL({
          format: "png",
          size: 512,
        })}&text=${text}`
      )
      .then(function (res) {
        const phEmbed = new EmbedBuilder()
          .setColor("Grey")
          .setImage(res.body.message)
          .setTimestamp();
        return interaction.reply({ embeds: [phEmbed] });
      });
  },
};
