const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
    subCommand: "levels.set-channel",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guildId } = interaction;
        const channel = options.getChannel("channel");
        const embed = new EmbedBuilder().setColor("Blurple");

        await interaction.deferReply();

        await GDB.findOneAndUpdate({
            id: guildId
        }, {
            $set: {
                'levels.channel': channel.id
            }
        });

        return interaction.editReply({
            embeds: [embed.setDescription(`🔹 | Got it, the level up messages will now be sent to: <#${channel.id}>.`)]
        })
    }
}