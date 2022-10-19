const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const { searchAnime } = require("node-kitsu");

module.exports = {
  botPermissions: ["SendMessages"],
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
  execute(interaction) {
    const { options } = interaction;
    const title = options.getString("title");
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    searchAnime(title, 0)
      .then((result) => {
        const anime = result[0];
        const status = anime.attributes.status
          .replace("finished", "Finished")
          .replace("ongoing", "Ongoing")
          .replace("current", "Currently Airing");

        if (!anime.attributes.averageRating) {
          embed.addFields({ name: "Rating", value: `No ratings yet.` });
        } else {
          embed.addFields({
            name: "Rating",
            value: `${anime.attributes.averageRating}`,
            inline: true,
          });
        }

        if (!anime.attributes.titles.en_us)
          embed.setTitle(`${anime.attributes.titles.en_jp}`);
        else {
          embed.setTitle(`${anime.attributes.titles.en_us}`);
        }

        return interaction.reply({
          embeds: [
            embed
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
              ]),
          ],
        });
      })
      .catch(() => {
        return interaction.reply({
          embeds: [embed.setDescription("No results found.")],
        });
      });
  },
};
