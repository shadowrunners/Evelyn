const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
    subCommand: "confessions.toggle",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guildId } = interaction;
        const data = await GDB.findOne({ id: guildId });
        const embed = new EmbedBuilder().setColor("Blurple");

        switch (options.getString("choice")) {
            case "enable":
                if (data.confessions.enabled === true)
                    return interaction.reply({
                        embeds: [embed.setDescription("🔹 | The confessions system is already enabled.")],
                        ephemeral: true,
                    });

                await GDB.findOneAndUpdate({
                    id: guildId,
                }, {
                    $set: {
                        'confessions.enabled': true
                    },
                });

                return interaction.reply({
                    embeds: [embed.setDescription("🔹 | The confessions system has been enabled.")],
                    ephemeral: true,
                });

            case "disable":
                if (data.confessions.enabled === false)
                    return interaction.reply({
                        embeds: [embed.setDescription("🔹 | The confessions system is already disabled.")],
                        ephemeral: true,
                    });

                await GDB.findOneAndUpdate({
                    id: guildId,
                }, {
                    $set: {
                        'confessions.enabled': false
                    },
                });

                return interaction.reply({
                    embeds: [embed.setDescription("🔹 | The confessions system has been disabled.")],
                    ephemeral: true,
                });
        }
    }
}