const { CommandInteraction, MessageEmbed } = require("discord.js");
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
            const link = `https://kitsu.io/anime/${anime.id}`;
            const status = anime.attributes.status.replace("finished", "Finished")
                .replace("ongoing", "Ongoing")

            const aniEmbed = new MessageEmbed()
                .setTitle(`[${anime.attributes.titles.en_us}](${link})`)
                .setColor("GREY")
                .setThumbnail(anime.attributes.posterImage.original)
                .setDescription(anime.attributes.synopsis)
                .addFields(
                    {
                        name: "Premiered on",
                        value: anime.attributes.startDate,
                        inline: true,
                    },
                    {
                        name: "Japanese Title",
                        inline: true,
                        value: [
                            `${anime.attributes.titles.en_jp}` || "Unknown.",
                        ].join("\n")
                    },
                    //{
                        //name: "Genres",
                        //value: anime.relationships.genres.data.map((genre) => genre.attributes.name).join(", "),
                        //inline: true,
                    //},
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
                )
            interaction.reply({embeds: [aniEmbed]});
        });
        

        //mal.getInfoFromName(titleSearch).then((data) => {
            //const aniEmbed = new MessageEmbed()
                //.setAuthor({name: `${data.title}`})
                //.setColor("BLURPLE")
                //.setThumbnail(data.picture)
                //.setDescription(data.synopsis)
                //.addFields(
                    //{
                        //name: "Premiere Date",
                        //inline: true,
                        //value: [
                            //`${data.premiered}` || "Unknown."
                        //].join("\n")
                    //},
                    //{
                        //name: "Genres",
                        //inline: true,
                        //value: [
                            //`${data.genres}`.split(',').join(', ')
                        //].join("\n")
                    //},
                    //
                        //: "English Title",
                        //inline: true,
                        //value: [
                            //`${data.englishTitle}` || "Unknown.",
                        //].join("\n")
                    //},
                    //{
                        //name: "Japanese Title",
                       // inline: true,
                        //value: [
                        //    `${data.japaneseTitle}` || "Unknown.",
                        //].join("\n")
                    //},
//{
                        //name: "Rating",
                        //inline: true,
                        //value: [
                            //`${data.rating}` || "Unknown.",
                        //].join("\n")
                    //},
                    //{
                        //name: "Aired",
                        //inline: true,
                        //value: [
                         //   `${data.aired}` || "Unknown.",
                        //].join("\n")
                    //},
                    //{
                       // name: "Score",
                       // inline: true,
                       // value: [
                       //     `${data.score}` || "Unknown.",
                        //].join("\n")
                    //},
                    //{
                       // name: "Duration",
                       // inline: true,
                       // value: [
                           // `${data.duration}` || "Unknown.",
                       // ].join("\n")
                    //},
                   // {
                       // name: "Status",
                       // inline: true,
                       // value: [
                       //     `${data.status}` || "Unknown.",
                       // ].join("\n")
                   // },
              //  )
            
        //}).catch((err) => {
            //const errEmbed = new MessageEmbed()
                //.setColor("BLURPLE")
                //.setDescription(`🔹 | No anime found.`)
            //return interaction.reply({embeds: [errEmbed]})
        //})
    },
};