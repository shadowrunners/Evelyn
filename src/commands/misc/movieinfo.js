const { CommandInteraction, EmbedBuilder } = require("discord.js");
const imdb = require("imdb-api");
const { imdbAPIKey } = require("../../structures/config.json");

module.exports = {
    name: "movieinfo",
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

        imdbClient.get({ name: `${title}` }, { timeout: 30000 }).then(async (result) => {
            const date = result.released;
            const movieinfoEmbed = new EmbedBuilder()
                .setAuthor({ name: `${result.title}` })
                .setColor("Grey")
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
                        name: "Director",
                        inline: true,
                        value: [
                            `${result.director}` || "Unknown.",
                        ].join("\n")
                    },
                    {
                        name: "Awards",
                        inline: true,
                        value: [
                            `${result.awards}` || "Unknown.",
                        ].join("\n")
                    },
                    {
                        name: "Box Office",
                        inline: true,
                        value: [
                            `${result.boxoffice}` || "Unknown.",
                        ].join("\n")
                    },
                    {
                        name: "Duration",
                        inline: true,
                        value: [
                            `${result.runtime}` || "Unknown.",
                        ].join("\n")
                    },
                    {
                        name: "Score",
                        inline: true,
                        value: [
                            `${result.metascore}/100` || "Unknown.",
                        ].join("\n")
                    },
                )
            interaction.reply({ embeds: [movieinfoEmbed] });
        }).catch((err) => {
            const errEmbed = new EmbedBuilder()
                .setColor("BLURPLE")
                .setDescription(`🔹 | No movie/show found.`)
            return interaction.reply({ embeds: [errEmbed] })
        })
    },
};