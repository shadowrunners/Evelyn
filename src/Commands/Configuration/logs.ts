import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ChannelType,
} from 'discord.js';
import { Command } from '../../interfaces/interfaces.js';

const { Administrator } = PermissionFlagsBits;
const { GuildText } = ChannelType;

const command: Command = {
	// botPermissions: ['SendMessages'],
	data: new SlashCommandBuilder()
		.setName('logs')
		.setDescription('Manage and configure logging.')
		.setDefaultMemberPermissions(Administrator)
		.addSubcommand((options) =>
			options
				.setName('toggle')
				.setDescription('Gives you the ability to toggle logging on and off.')
				.addStringOption((option) =>
					option
						.setName('choice')
						.setDescription('Select one of the choices.')
						.setRequired(true)
						.addChoices(
							{ name: 'Enable', value: 'enable' },
							{ name: 'Disable', value: 'disable' },
						),
				),
		)
		.addSubcommand((options) =>
			options
				.setName('set-channel')
				.setDescription('Sets the channel where logs will be sent.')
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setDescription('Provide the channel.')
						.addChannelTypes(GuildText)
						.setRequired(true),
				),
		),
};

export default command;
