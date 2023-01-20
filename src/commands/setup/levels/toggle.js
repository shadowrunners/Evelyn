const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
    subCommand: "levels.toggle",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guildId } = interaction;
        let data = await GDB.findOne({ id: guildId });
        const embed = new EmbedBuilder().setColor("Blurple");

        await interaction.deferReply();

        switch (options.getString("choice")) {
            case "enable":
                if (data.levels.enabled === true)
                    return interaction.editReply({ embeds: [embed.setDescription("🔹 | The levelling system is already enabled.")] })

                await GDB.findOneAndUpdate({
                    id: guildId,
                }, {
                    $set: {
                        levels: {
                            enabled: true
                        }
                    }
                })


                return interaction.editReply({ embeds: [embed.setDescription("🔹 | The levelling system has been enabled.")] })

            case "disable":
                if (data.levels.enabled === false)
                    return interaction.editReply({ embeds: [embed.setDescription("🔹 | The levelling system is already disabled.")] })

                await GDB.findOneAndUpdate({
                    id: guildId,
                }, {
                    $set: {
                        levels: {
                            enabled: false
                        }
                    }
                })

                return interaction.editReply({ embeds: [embed.setDescription("🔹 | The levelling system has been disabled.")], ephemeral: true })
        }
    }
}