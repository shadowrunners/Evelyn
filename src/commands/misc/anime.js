const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const kitsu = require("node-kitsu");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anime")
    .setDescription("Get info about an anime using Kitsu.io.")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Provide the name of the anime.")
        .setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const title = interaction.options.getString("title");

    kitsu
      .searchAnime(title, 0)
      .then((result) => {
        const anime = result[0];
        const status = anime.attributes.status
          .replace("finished", "Finished")
          .replace("ongoing", "Ongoing");
        const aniEmbed = new EmbedBuilder()
          .setTitle(`${anime.attributes.titles.en_us}`)
          .setColor("Grey")
          .setThumbnail(anime.attributes.posterImage.original)
          .setDescription(anime.attributes.synopsis)
          .addFields([
            {
              name: "Premiered on",
              value: anime.attributes.startDate,
              inline: true,
            },
            {
              name: "Japanese Title",
              value: `${anime.attributes.titles.en_jp}` || "Unknown.",
              inline: true,
            },
            {
              name: "Status",
              value: status,
              inline: true,
            },
            {
              name: "Rating",
              value: `${anime.attributes.averageRating}%`,
              inline: true,
            },
          ]);
        return interaction.reply({ embeds: [aniEmbed] });
      })
      .catch(() => {
        const errorEmbed = new EmbedBuilder()
          .setColor("Grey")
          .setDescription("No results found.");
        return interaction.reply({ embeds: [errorEmbed] });
      });
  },
};
