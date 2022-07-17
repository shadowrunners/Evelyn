const { CommandInteraction, MessageEmbed } = require("discord.js")
const { cattoKey } = require("../../structures/config.json");
const fetch = require("node-fetch")

module.exports = {
    name: "cat",
    description: "See a random cat picture!",
    public: true,
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        fetch("https://api.thecatapi.com/v1/images/search", {
                method: "GET",
                headers: {
                    'x-api-key': cattoKey
                }
            })
        .then(function(result) { return result.json(); })
        .then(function([data]) {
            const cattoEmbed = new MessageEmbed()
                .setColor("BLURPLE")
                .setAuthor({name: "Here's a random picture of a cat!"})
                .setImage(data.url)
                .setTimestamp()
                .setFooter({text: "These images have been brought to you by TheCatAPI."})
            return interaction.reply({embeds: [cattoEmbed]})
        })
    }
}     
            

    
