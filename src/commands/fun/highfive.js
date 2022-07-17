const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const superagent = require("superagent");

module.exports = {
    name: "highfive",
    description: "Highfive someone.",
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
        const { body } = await superagent.get("https://api.waifu.pics/sfw/highfive");

        const lonerFive = new MessageEmbed()
            .setAuthor({
            name: `${interaction.user.username} highfives ${client.user.username}!`,
            iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({ text: "You're doing great, honey. <3" })
            .setImage(body.url)
            .setTimestamp();
    
      if (target.id === interaction.user.id)
        return interaction.reply({ embeds: [lonerFive] });

        const highfiveEmbed = new MessageEmbed()
            .setColor("BLURPLE")
            .setAuthor({name: `${interaction.user.username} highfives ${target.user.username}!`, iconURL: `${interaction.user.avatarURL({dynamic: true})}`})
            .setImage(body.url)
            .setTimestamp()
        interaction.reply({embeds: [highfiveEmbed]});
    }
}