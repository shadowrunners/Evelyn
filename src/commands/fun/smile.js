const { CommandInteraction, MessageEmbed } = require("discord.js");
const superagent = require("superagent");

// Credits to Ureshi#9090 for the original /hug command which I used as a template for all of these emotion commands.

module.exports = {
    name: "smile",
    description: ":) but in glorious GIF form.",
    public: true,
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const { body } = await superagent.get("https://api.waifu.pics/sfw/smile");
        const smileEmbed = new MessageEmbed()
            .setColor("BLURPLE")
            .setAuthor({name: `${interaction.user.username} smiles!`, iconURL: `${interaction.user.avatarURL({dynamic: true})}`})
            .setImage(body.url)
            .setTimestamp()
        interaction.reply({embeds: [smileEmbed]});
    }
}