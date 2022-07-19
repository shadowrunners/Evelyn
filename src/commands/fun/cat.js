const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { cattoKey } = require("../../structures/config.json");
const superagent = require("superagent");

module.exports = {
    name: "cat",
    description: "See a random cat picture!",
    public: true,
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        superagent.get("https://api.thecatapi.com/v1/images/search", {
            headers: {
                'x-api-key': cattoKey
            }
        })
        .then(function(res) {
            const cattoEmbed = new EmbedBuilder()
                .setColor("Grey")
                .setAuthor({name: "Here's a random picture of a cat!"})
                .setImage(res.body[0].url)
                .setTimestamp()
                .setFooter({text: "These images have been brought to you by TheCatAPI."})
            return interaction.reply({embeds: [cattoEmbed]})
        })
    }
}     
            

    
