const { ButtonInteraction, InteractionType } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ButtonInteraction} interaction
     */
    execute(interaction, client) {
        if(!interaction.type === InteractionType.MessageComponent) return;
        const Button = client.buttons.get(interaction.customId);
        if(!Button) return;

        if(Button.permission && !interaction.member.permissions.has(Button.permission)) return interaction.reply({content: "You do not have the required permission to use this button.", ephemeral: true});
        if(Button.ownerOnly && interaction.member.id !== interaction.guild.ownerId) return interaction.reply({content: "Only the owner of this guild has access to this button.", ephemeral: true});

        Button.execute(interaction, client);
    }
}