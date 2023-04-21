import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../Interfaces/interfaces.js';
const { SendMessages } = PermissionFlagsBits;

const command: Command = {
	botPermissions: [SendMessages],
	data: new SlashCommandBuilder()
		.setName('economy')
		.setDescription('A full economy system.')
		.addSubcommand((options) =>
			options
				.setName('balance')
				.setDescription(
					'Displays your current balance or another user\'s balance.',
				)
				.addUserOption((option) =>
					option
						.setName('target')
						.setDescription('Provide a target.')
						.setRequired(false),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('daily')
				.setDescription('Injects some coins into your wallet on a daily basis.'),
		)
		.addSubcommand((options) =>
			options
				.setName('deposit')
				.setDescription(
					'Deposits a part of your SC to your ShadowBank account.',
				)
				.addNumberOption((option) =>
					option
						.setName('number')
						.setDescription('Provide the amount you\'d like to deposit.')
						.setRequired(true),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('history')
				.setDescription('Shows you your purchase history.'),
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
