const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { Administrator } = PermissionFlagsBits;
const { GuildText } = ChannelType;

module.exports = {
    botPermissions: ['SendMessages', 'EmbedLinks', 'Connect', 'Speak'],
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Manage and configure roles.')
        .setDefaultMemberPermissions(Administrator)
        .addSubcommand((options) =>
            options
                .setName('add-role')
                .setDescription('Adds a role to the dropdown menu of the roles panel.')
                .addStringOption((option) =>
                    option
                        .setName("panel")
                        .setDescription("Provide the name of the panel this role belongs to.")
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("Provide a role.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("description")
                        .setDescription("Provide a description of the role.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("emoji")
                        .setDescription("Provide an emoji for the role.")
                        .setRequired(true)
                )
        )
        .addSubcommand((options) =>
            options
                .setName('remove-role')
                .setDescription('Removes a role from the dropdown menu of the roles panel.')
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("Provide a role.")
                        .setRequired(true)
                )
        )
        .addSubcommand((options) =>
            options
                .setName('new-panel')
                .setDescription('Creates a new panel.')
                .addStringOption((option) =>
                    option
                        .setName("name")
                        .setDescription("Provide the name of the panel.")
                        .setRequired(true)
                )
        )
        .addSubcommand((options) =>
            options
                .setName('send-panel')
                .setDescription('Sends the specified Roles panel.')
                .addStringOption((option) =>
                    option
                        .setName('panel')
                        .setDescription('Provide the name of the panel you\'d like to send.')
                        .setRequired(true),
                )
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("Provide a channel")
                        .addChannelTypes(GuildText)
                        .setRequired(true)
                )
        ),
};
