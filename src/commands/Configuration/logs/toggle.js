const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
    subCommand: "logs.toggle",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guildId } = interaction;
        const data = await GDB.findOne({ id: guildId });
        const embed = new EmbedBuilder().setColor("Blurple");

        await interaction.deferReply({ ephemeral: true });

        switch (options.getString("choice")) {
            case "enable":
                if (data.logs.enabled === true)
                    return interaction.editReply({ embeds: [embed.setDescription("🔹 | The logging system is already enabled.")] });

                await GDB.findOneAndUpdate({
                    id: guildId,
                }, {
                    $set: {
                        'logs.enabled': true
                    },
                });

                return interaction.editReply({ embeds: [embed.setDescription("🔹 | The logging system has been enabled.")] });

            case "disable":
                if (data.logs.enabled === false)
                    return interaction.editReply({ embeds: [embed.setDescription("🔹 | The logging system is already disabled.")] });

                await GDB.findOneAndUpdate({
                    id: guildId,
                }, {
                    $set: {
                        'logs.enabled': false
                    },
                });

                return interaction.editReply({ embeds: [embed.setDescription("🔹 | The logging system has been disabled.")] });
        }
    }
}