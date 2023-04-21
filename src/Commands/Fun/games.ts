import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../Interfaces/Interfaces';
const { SendMessages } = PermissionFlagsBits;

const command: Command = {
	botPermissions: [SendMessages],
	data: new SlashCommandBuilder()
		.setName('games')
		.setDescription('A full game system.')
		.addSubcommand((options) =>
			options
				.setName('2048')
				.setDescription('Enjoy a nice game of 2048 inside Discord.'),
		)
		.addSubcommand((options) =>
			options
				.setName('connect4')
				.setDescription('Invite your friend to a nice round of Connect4.')
				.addUserOption((option) =>
					option
						.setName('target')
						.setDescription('Provide a target')
						.setRequired(true),
				),
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
