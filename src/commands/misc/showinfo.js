const { CommandInteraction, EmbedBuilder } = require("discord.js");
const imdb = require("imdb-api");
const { imdbAPIKey } = require("../../structures/config.json");

module.exports = {
    name: "showinfo",
    description: "See information about a show.",
    public: true,
    options: [
        {
            name: "title",
            description: "Provide the name of the movie or show.",
            type: 3,
            required: true,
        },
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const imdbClient = new imdb.Client({ apiKey: imdbAPIKey });
        const title = interaction.options.getString("title");

        imdbClient.get({ name: `${title}`, type: imdb.TVShow }, { timeout: 30000 }).then(async (result) => {
            const date = result.released;
            const showinfoEmbed = new EmbedBuilder()
                .setAuthor({ name: `${result.title}` })
                .setColor("BLURPLE")
                .setThumbnail(result.poster)
                .setDescription(result.plot)
                .addFields(
                    {
                        name: "Released",
                        inline: true,
                        value: [
                            `${date.toLocaleDateString("en-GB")}` || "Unknown."
                        ].join("\n")
                    },
                    {
                        name: "Seasons",
                        inline: true,
                        value: [
                            `${result.totalseasons}` || "Unknown.",
                        ].join("\n")
                    },
                    {
                        name: "Genres",
                        inline: true,
                        value: [
                            `${result.genres}`.split(',').join(', ')
                        ].join("\n")
                    },
                    {
                        name: "Rating",
                        inline: true,
                        value: [
                            `${result.rating}` || "Unknown.",
                        ].join("\n")
                    },
                    {
                        name: "Actors",
                        inline: true,
                        value: [
                            `${result.actors}` || "Unknown.",
                        ].join("\n")
                    },
                    {
                        name: "Awards",
                        inline: true,
                        value: [
                            `${result.awards}` || "Unknown.",
                        ].join("\n")
                    },
                )
            interaction.reply({ embeds: [showinfoEmbed] });

        }).catch((e) => {
            const errEmbed = new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription(`🔹 | No movie/show found.`)
            return interaction.reply({ embeds: [errEmbed] })
        },
        )
    }
};