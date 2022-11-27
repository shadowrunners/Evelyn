const {
  Client,
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const { get } = require("superagent");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("See a random cat picture!"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    get("https://api.thecatapi.com/v1/images/search", {
      headers: {
        "x-api-key": client.config.cattoKey,
      },
    }).then((res) => {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setImage(res.body[0].url)
            .setTimestamp(),
        ],
      });
    });
  },
};
