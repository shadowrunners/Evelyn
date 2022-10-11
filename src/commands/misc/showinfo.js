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
    .setName("show")
    .setDescription("Search for a TV show using IMDB.")
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
  async execute(interaction, client) {
    const imdbClient = new imdb.Client({ apiKey: client.config.imdbAPIKey });
    const title = interaction.options.getString("title");

    imdbClient
      .get({ name: `${title}`, type: imdb.TVShow }, { timeout: 30000 })
      .then(async (result) => {
        const date = result.released;
        const showinfoEmbed = new EmbedBuilder()
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
              name: "Seasons",
              inline: true,
              value: `${result.totalseasons} season(s)` || "Unknown.",
            },
            {
              name: "Genres",
              inline: true,
              value: `${result.genres}`.split(",").join(", "),
            },
            {
              name: "Rating",
              inline: true,
              value: `${result.rating}` || "Unknown.",
            },
            {
              name: "Actors",
              inline: true,
              value: `${result.actors}` || "Unknown.",
            },
            {
              name: "Awards",
              inline: true,
              value: `${result.awards}` || "Unknown.",
            },
          ]);
        interaction.reply({ embeds: [showinfoEmbed] });
      })
      .catch(() => {
        const errEmbed = new EmbedBuilder()
          .setColor("Grey")
          .setDescription(`No results found.`);
        return interaction.reply({ embeds: [errEmbed] });
      });
  },
};
