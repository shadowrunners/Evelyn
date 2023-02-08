const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { Administrator } = PermissionFlagsBits;
const { GuildText } = ChannelType;

module.exports = {
    botPermissions: ['SendMessages'],
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Manage and configure welcoming.')
        .setDefaultMemberPermissions(Administrator)
        .addSubcommand((options) =>
            options
                .setName('toggle')
                .setDescription('Gives you the ability to toggle welcoming on and off.')
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
                .setName('manage-embed')
                .setDescription('Manage the embed sent when a user joins the server.')
                .addStringOption((option) =>
                    option
                        .setName("color")
                        .setDescription("Provide the hex value of the color.")
                )
                .addStringOption((option) =>
                    option
                        .setName("title")
                        .setDescription("Provide a title for the embed.")
                )
                .addStringOption((option) =>
                    option
                        .setName("description")
                        .setDescription("Provide a description for the embed.")
                )
                .addStringOption((option) =>
                    option
                        .setName("author-name")
                        .setDescription("Provide a name for the author tag of the embed.")
                )
                .addStringOption((option) =>
                    option
                        .setName("author-icon")
                        .setDescription("Provide a link to an image for the icon URL displayed next to the author name.")
                )
                .addStringOption((option) =>
                    option
                        .setName("footer-text")
                        .setDescription("Provide the text you'd like to use for the embed's footer.")
                )
                .addStringOption((option) =>
                    option
                        .setName("footer-icon")
                        .setDescription("Provide a link to an image for the footer's icon.")
                )
                .addStringOption((option) =>
                    option
                        .setName("image")
                        .setDescription("Provide a link to an image for the embed.")
                )
                .addStringOption((option) =>
                    option
                        .setName("thumbnail")
                        .setDescription("Provide a thumbnail to an image for the embed.")
                )
                .addStringOption((option) =>
                    option
                        .setName("messagecontent")
                        .setDescription("Provide a message that will be sent alongside the embed.")
                )
        )
        .addSubcommand((options) =>
            options
                .setName('preview-embed')
                .setDescription('Sends a preview of the embed.')
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("Select a channel.")
                        .addChannelTypes(GuildText)
                        .setRequired(true)
                )
        ),
};
