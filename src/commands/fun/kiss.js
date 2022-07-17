const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const superagent = require("superagent");

module.exports = {
    name: "kiss",
    description: "Kiss someone.",
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
        const { body } = await superagent.get("https://api.waifu.pics/sfw/kiss");

        if (target.id === interaction.user.id) {
            const lonerKiss = new MessageEmbed()
                .setColor("BLURPLE")
                .setAuthor({ 
                    name: `${client.user.username} kisses ${target.user.username}!`, 
                    iconURL: `${client.user.avatarURL({ dynamic: true })}` 
                })
                .setImage(body.url)
                .setTimestamp()
            return interaction.reply({ embeds: [lonerKiss] });
        }

        if (target.id !== interaction.user.id) {
            const kissEmbed = new MessageEmbed()
                .setColor("BLURPLE")
                .setAuthor({ name: `${interaction.user.username} kisses ${target.user.username}!`, iconURL: `${target.user.avatarURL({ dynamic: true })}` })
                .setImage(body.url)
                .setTimestamp()
            return interaction.reply({ embeds: [kissEmbed] });
        }
    }
}