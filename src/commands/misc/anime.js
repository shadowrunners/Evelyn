const { CommandInteraction, EmbedBuilder } = require("discord.js");
const kitsu = require("node-kitsu");

module.exports = {
    name: "anime",
    description: "See information about an anime.",
    public: true,
    options: [
        {
            name: "title",
            description: "Provide the name of the anime.",
            type: 3,
            required: true,
        },
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const title = interaction.options.getString("title");

        kitsu.searchAnime(title, 0).then((result) => {
            const anime = result[0];
            const status = anime.attributes.status.replace("finished", "Finished")
                .replace("ongoing", "Ongoing")
            const type = anime.attributes.subtype.replace("movie", "Movie")
            const startDate = anime.attributes.startDate;
            const endDate = anime.attributes.endDate;

            const sDate = new Date(startDate);
            const eDate = new Date(endDate);

            const unixStartDate = Math.floor(sDate.getTime() / 1000);
            const unixEndDate = Math.floor(eDate.getTime() / 1000);

            const aniEmbed = new EmbedBuilder()
                .setTitle(`${anime.attributes.titles.en_us}`)
                .setColor("Grey")
                .setThumbnail(anime.attributes.posterImage.original)
                .setDescription(anime.attributes.synopsis)
                .addFields(
                    {name: "Premiered", value: `<t:${unixStartDate}:R>`, inline: true},
                    {name: "Type", value: `${type}`, inline: true},
                    {name: "Japanese Title", value: `${anime.attributes.titles.en_jp}`, inline: true},
                    {name: "Aired", value: `<t:${unixStartDate}:R> - <t:${unixEndDate}:R>`, inline: true},
                    {name: "Status", value: `${status}`, inline: true},
                    {name: "Episodes", value: `${anime.attributes.episodeCount}`, inline: true},
                    {name: "Rating", value: `${anime.attributes.averageRating}/100`, inline: true},
                )
            interaction.reply({embeds: [aniEmbed]});
        }).catch(err => {
            const noAnime = new EmbedBuilder()
                .setDescription("Couldn't find an anime with that name.")
                .setColor("Grey")
            interaction.reply({ embeds: [noAnime] });
        });
    },
};