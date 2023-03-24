import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../Interfaces/interfaces.js';

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Shows information about the current server.')
		.addSubcommand((options) =>
			options
				.setName('info')
				.setDescription('Shows information about the current server.'),
		)
		.addSubcommand((options) =>
			options
				.setName('roles')
				.setDescription('Shows the roles that are currently available.'),
		),
};

export default command;
