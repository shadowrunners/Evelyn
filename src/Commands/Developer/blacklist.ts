import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../Interfaces/interfaces.js';
const { SendMessages } = PermissionFlagsBits;

const command: Command = {
	botPermissions: [SendMessages],
	developer: true,
	data: new SlashCommandBuilder()
		.setName('blacklist')
		.setDescription('Blacklist a user or server from using the bot.')
		.addSubcommand((options) =>
			options
				.setName('server')
				.setDescription('Blacklist a server.')
				.addStringOption((option) =>
					option
						.setName('serverid')
						.setDescription(
							'Provide the server ID of the server you would like to blacklist.',
						)
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('reason')
						.setDescription('Provide the reason of the blacklist.')
						.setRequired(true),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('user')
				.setDescription('Blacklist a user.')
				.addStringOption((option) =>
					option
						.setName('userid')
						.setDescription(
							'Provide the ID of the user you would like to blacklist.',
						)
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('reason')
						.setDescription('Provide the reason of the blacklist.')
						.setRequired(true),
				),
		),
};

export default command;
