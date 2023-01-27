const { StringSelectMenuInteraction } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {StringSelectMenuInteraction} interaction
     */
    execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        const { member, customId, values, component } = interaction;

        if (customId === "reaction") {
            component.data.options.forEach(option => {
                if (!values.includes(option.value) && member.roles.cache.has(option.value)) {
                    member.roles.remove(option.value);
                }
            });

            values.forEach(id => {
                if (!member.roles.cache.has(id)) member.roles.add(id);
            })

            interaction.reply({ content: "Your roles have been updated.", ephemeral: true });
        };
    }
}
