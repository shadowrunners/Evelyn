const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
    subCommand: "levels.set-levelupmessage",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guildId } = interaction;
        const providedMessage = options.getString("message");
        const embed = new EmbedBuilder().setColor("Blurple");

        await interaction.deferReply();

        await GDB.findOneAndUpdate({
            id: guildId,
        }, {
            $set: {
                'levels.message': providedMessage
            }
        })

        return interaction.editReply({
            embeds: [embed.setDescription('🔹 | Got it, the level up message you provided has been set.')]
        })
    }
}