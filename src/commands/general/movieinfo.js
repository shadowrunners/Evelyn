const {
  Client,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const imdb = require("imdb-api");

module.exports = {
  botPermissions: ["SendMessages"],
  data: new SlashCommandBuilder()
    .setName("movie")
    .setDescription("Search for a movie using IMDB.")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Provide the name of the movie.")
        .setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const imdbClient = new imdb.Client({ apiKey: client.config.imdbAPIKey });
    const title = interaction.options.getString("title");

    imdbClient
      .get({ name: `${title}` }, { timeout: 30000 })
      .then( (result) => {
        const date = result.released;
        const movieinfoEmbed = new EmbedBuilder()
          .setAuthor({ name: `${result.title}` })
          .setColor("Grey")
          .setThumbnail(result.poster)
          .setDescription(result.plot)
          .addFields([
            {
              name: "Released",
              inline: true,
              value: `${date.toLocaleDateString("en-GB")}` || "Unknown.",
            },
            {
              name: "Genres",
              inline: true,
              value: `${result.genres}`.split(",").join(", "),
            },
            {
              name: "Rating",
              inline: true,
              value: `${result.rating}/10` || "Unknown.",
            },
            {
              name: "Box Office",
              inline: true,
              value: `${result.boxoffice}` || "Unknown.",
            },
            {
              name: "Duration",
              inline: true,
              value: `${result.runtime}` || "Unknown.",
            },
            {
              name: "Score",
              inline: true,
              value: `${result.metascore}/100` || "Unknown.",
            },
          ]);
        interaction.reply({ embeds: [movieinfoEmbed] });
      })
      .catch(() => {
        const errEmbed = new EmbedBuilder()
          .setColor("Grey")
          .setDescription(`No results found.`);
        return interaction.reply({ embeds: [errEmbed] });
      });
  },
};
