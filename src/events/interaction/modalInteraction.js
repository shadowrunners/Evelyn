const { ModalSubmitInteraction, EmbedBuilder, Client } = require("discord.js");
const { isBlacklisted } = require('../../functions/isBlacklisted.js');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ModalSubmitInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { user, member } = interaction;
        if (!interaction.isModalSubmit()) return;

        const embed = new EmbedBuilder().setColor('Blurple');
        const modal = client.modals.get(interaction.customId);
        if (await isBlacklisted(interaction)) return;

        if (!modal || modal === undefined) return;

        if (modal.permission && !member.permissions.has(modal.permission))
            return interaction.reply({
                embeds: [embed.setDescription('🔹 | You don\'t have the required permissions to use this button.')],
                ephemeral: true,
            });

        if (modal.developer && user.id !== client.config.ownerIDs)
            return interaction.reply({
                embeds: [
                    embed.setDescription('🔹 | This button is only available to developers.')
                ],
                ephemeral: true,
            });

        modal.execute(interaction, client);
    },
};