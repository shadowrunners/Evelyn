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
        const numberOfPanels = await RDB.findOne({ id: guildId });

        await interaction.deferReply({ ephemeral: true });

        if (rData) return interaction.editReply({ embeds: [embed.setDescription("🔹 | A panel with this name already exists.")] });
        if (numberOfPanels.length >= 10) return interaction.editReply({ embeds: [embed.setDescription("🔹 | You can only have 10 reaction role panels.")] });

        await RDB.create({
            panelName: panel,
            id: guildId,
        });

        return interaction.editReply({ embeds: [embed.setDescription(`🔹 | Your panel ${panel} has been created. You can add roles to it via /roles add-role.`)] })
    }
}