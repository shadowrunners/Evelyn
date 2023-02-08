const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
    subCommand: "qotd.toggle",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guildId } = interaction;
        const data = await GDB.findOne({ id: guildId });
        const embed = new EmbedBuilder().setColor("Blurple");

        await interaction.deferReply();

        switch (options.getString("choice")) {
            case "enable":
                if (data.qotd.enabled === true)
                    return interaction.editReply({ embeds: [embed.setDescription("🔹 | The QOTD system is already enabled.")] })

                await GDB.findOneAndUpdate({
                    id: guildId,
                }, {
                    $set: {
                        'qotd.enabled': true
                    }
                })

                return interaction.editReply({ embeds: [embed.setDescription("🔹 | The QOTD system has been enabled.")] })

            case "disable":
                if (data.qotd.enabled === false)
                    return interaction.editReply({ embeds: [embed.setDescription("🔹 | The QOTD system is already disabled.")] })

                await GDB.findOneAndUpdate({
                    id: guildId,
                }, {
                    $set: {
                        'qotd.enabled': false
                    }
                })

                return interaction.editReply({ embeds: [embed.setDescription("🔹 | The QOTD system has been disabled.")], ephemeral: true })
        }
    }
}