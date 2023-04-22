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
						.setName('amount')
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
			options.setName('inventory').setDescription('Shows you your inventory.'),
		)
		.addSubcommand((options) =>
			options
				.setName('leaderboard')
				.setDescription('Shows you the global leaderboard.'),
		)
		.addSubcommand((options) =>
			options
				.setName('weekly')
				.setDescription(
					'Injects some coins into your wallet on a weekly basis.',
				),
		)
		.addSubcommand((options) =>
			options
				.setName('withdraw')
				.setDescription(
					'Withdraws an amount of SC from your ShadowBank wallet.',
				)
				.addNumberOption((option) =>
					option
						.setName('amount')
						.setDescription('Provide the amount you\'d like to withdraw.')
						.setRequired(true),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('work')
				.setDescription('Take a side gig to charge up your wallet.'),
		),
};

export default command;
