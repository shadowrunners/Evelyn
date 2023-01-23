const { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const RDB = require("../../../structures/schemas/roles.js");

module.exports = {
    subCommand: "roles.list-panels",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guildId, guild } = interaction;
        const embed = new EmbedBuilder().setColor("Blurple");
        const data = await RDB.find({ id: guildId });

        await interaction.deferReply();

        if (!data) return;

        data.forEach((docs) => {
            const roleArray = docs.roleArray.map(role => {
                return `<@&${role.roleId}>`;
            }).join("\n");

            embed.addFields({ name: docs.panelName, value: roleArray });
            return interaction.editReply({ embeds: [embed] });
        })
    }
}