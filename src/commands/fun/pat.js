const { CommandInteraction, Client, EmbedBuilder } = require("discord.js");
const superagent = require("superagent");

module.exports = {
    name: "pat",
    description: "Pat someone.",
    public: true,
    options: [
        {
            name: "target",
            description: "Provide a target.",
            type: 6,
            required: true,
        },
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const target = interaction.options.getMember("target");
            await target.user.fetch();
        const { body } = await superagent.get("https://api.waifu.pics/sfw/pat");

        const lonerPat = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
                name: `${client.user.username} pats ${interaction.user.username}!`,
                iconURL: `${client.user.avatarURL({ dynamic: true })}`,
            })
            .setImage(body.url)
            .setTimestamp();

        if (target.id === interaction.user.id)
        return interaction.reply({ embeds: [lonerPat] });

        const patEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
                name: `${interaction.user.username} pats ${target.user.username}!`, 
                iconURL: `${interaction.user.avatarURL({dynamic: true})}`
            })
            .setImage(body.url)
            .setTimestamp()
        interaction.reply({embeds: [patEmbed]});
    }
}