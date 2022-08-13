const {
  Client,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const superagent = require("superagent");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("See a random cat picture!"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    superagent
      .get("https://api.thecatapi.com/v1/images/search", {
        headers: {
          "x-api-key": client.config.cattoKey,
        },
      })
      .then(function (res) {
        const cattoEmbed = new EmbedBuilder()
          .setColor("Grey")
          .setAuthor({ name: "Here's a random picture of a cat!" })
          .setImage(res.body[0].url)
          .setTimestamp()
          .setFooter({
            text: "These images have been brought to you by TheCatAPI.",
          });
        return interaction.reply({ embeds: [cattoEmbed] });
      });
  },
};
