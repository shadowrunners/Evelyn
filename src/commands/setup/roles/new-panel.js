const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const RDB = require("../../../structures/schemas/roles.js");

module.exports = {
    subCommand: "roles.new-panel",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guildId } = interaction;
        const embed = new EmbedBuilder().setColor("Blurple");

        const panel = options.getString("name");
        const rData = await RDB.findOne({ id: guildId, panelName: panel });

        await interaction.deferReply();

        if (rData) return interaction.editReply({ embeds: [embed.setDescription("🔹 | A panel with this name already exists.")] })

        await RDB.create({
            panelName: panel,
            id: guildId,
        });

        return interaction.editReply({ embeds: [embed.setDescription(`🔹 | This panel has been created.`)] })
    }
}