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
    const { options } = interaction;
    const title = options.getString("title");
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
    const imdbClient = new imdb.Client({ apiKey: client.config.imdbAPIKey });

    imdbClient
      .get({ name: `${title}` }, { timeout: 30000 })
      .then((result) => {
        const date = result.released;

        return interaction.reply({
          embeds: [
            embed
              .setAuthor({ name: `${result.title}` })
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
              ]),
          ],
        });
      })
      .catch(() => {
        return interaction.reply({
          embeds: [embed.setDescription(`No results found.`)],
        });
      });
  },
};
