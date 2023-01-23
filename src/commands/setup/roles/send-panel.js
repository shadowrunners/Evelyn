const { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const RDB = require("../../../structures/schemas/roles.js");

module.exports = {
    subCommand: "roles.send-panel",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guildId, guild } = interaction;

        const panel = options.getString("panel");
        const channel = options.getChannel("channel");
        const data = await RDB.findOne({ id: guildId, panelName: panel });

        await interaction.deferReply();

        if (!data.roleArray.length > 0)
            return interaction.editReply({ content: "This server does not have any data.", ephemeral: true });

        if (panel !== data.panelName)
            return interaction.deferReply({ content: "Couldn't find any data regarding the panel name provided." })

        const panelEmbed = new EmbedBuilder()
            .setTitle(`${data.panelName}`)
            .setColor("Blurple")

        const opts = data.roleArray.map(x => {
            const role = guild.roles.cache.get(x.roleId);

            return {
                label: role.name,
                value: role.id,
                description: x.description,
                emoji: x.emoji || undefined
            };
        });

        console.log(opts)

        const menuComponents = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("reaction")
                    .setPlaceholder(data.panelName)
                    .setMinValues(0)
                    .setMaxValues(opts.length)
                    .addOptions(opts)
            )

        await channel.send({ embeds: [panelEmbed], components: [menuComponents] });
        return interaction.editReply({ content: "Succesfully sent your panel.", ephemeral: true });
    }
}