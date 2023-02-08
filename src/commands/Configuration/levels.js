const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { Administrator } = PermissionFlagsBits;
const { GuildText } = ChannelType;

module.exports = {
    botPermissions: ['SendMessages'],
    data: new SlashCommandBuilder()
        .setName('levels')
        .setDescription('Manage and configure levels.')
        .setDefaultMemberPermissions(Administrator)
        .addSubcommand((options) =>
            options
                .setName('toggle')
                .setDescription('Gives you the ability to toggle leveling on and off.')
                .addStringOption((option) =>
                    option
                        .setName("choice")
                        .setDescription("Select one of the choices.")
                        .setRequired(true)
                        .addChoices(
                            { name: "Enable", value: "enable" },
                            { name: "Disable", value: "disable" }
                        )
                )
        )
        .addSubcommand((options) =>
            options
                .setName('set-channel')
                .setDescription('Sets the channel where level up messages will be sent.')
                .addChannelOption((option) =>
                    option
                        .setName('channel')
                        .setDescription('Provide the channel.')
                        .addChannelTypes(GuildText)
                        .setRequired(true),
                ),
        )
        .addSubcommand((options) =>
            options
                .setName('set-levelupmessage')
                .setDescription('Sets the Level Up message.')
                .addStringOption((option) =>
                    option
                        .setName('message')
                        .setDescription('Provide the message you\'d like to be displayed.')
                        .setRequired(true),
                ),
        ),
};
