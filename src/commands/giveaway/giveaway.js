const {
	SlashCommandBuilder,
	PermissionsBitField,
	ChannelType,
} = require('discord.js');
const { ManageGuild } = PermissionsBitField.Flags;
const { GuildText } = ChannelType;

module.exports = {
	botPermissions: ['SendMessages', 'ManageGuild'],
	data: new SlashCommandBuilder()
		.setName('giveaway')
		.setDescription('Create a giveaway or manage a giveaway.')
		.setDefaultMemberPermissions(ManageGuild)
		.addSubcommand((options) =>
			options
				.setName('create')
				.setDescription('Create a giveaway.')
				.addStringOption((options) =>
					options
						.setName('duration')
						.setDescription('Provide a duration for this giveaway.')
						.setRequired(true),
				)
				.addIntegerOption((options) =>
					options
						.setName('winners')
						.setDescription('Provide the amount of winners for this giveaway.')
						.setRequired(true),
				)
				.addStringOption((options) =>
					options
						.setName('prize')
						.setDescription('Provide the name of the prize.')
						.setRequired(true),
				)
				.addChannelOption((options) =>
					options
						.setName('channel')
						.setDescription('Select a channel to send the giveaway to.')
						.addChannelTypes(GuildText),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('end')
				.setDescription('End a giveaway.')
				.addStringOption((option) =>
					option
						.setName('messageid')
						.setDescription('Provide the message of the giveaway ID.')
						.setRequired(true),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('pause')
				.setDescription('Pauses a giveaway.')
				.addStringOption((option) =>
					option
						.setName('messageid')
						.setDescription('Provide the message of the giveaway ID.')
						.setRequired(true),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('unpause')
				.setDescription('Unpauses a giveaway.')
				.addStringOption((option) =>
					option
						.setName('messageid')
						.setDescription('Provide the message of the giveaway ID.')
						.setRequired(true),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('reroll')
				.setDescription('Rerolls a giveaway.')
				.addStringOption((option) =>
					option
						.setName('messageid')
						.setDescription('Provide the message of the giveaway ID.')
						.setRequired(true),
				),
		),
};
