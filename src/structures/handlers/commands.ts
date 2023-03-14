import { Evelyn } from "../Evelyn";
import { magenta, green, white } from 'chalk';
import { fileLoad } from '../../functions/fileLoader';

/** Loads the commands. */
export async function loadCommands(client: Evelyn) {
	client.commands.clear();
	client.subCommands.clear();

	const commandsArray = [];
	const developerArray = [];

	const files = await fileLoad('commands');
	for (const file of files) {
		const commandFile = require(file);
		const { command, subCommand, developer } = commandFile;

		//if (subCommand) return client.subCommands.set(subCommand, command);
		client.commands.set(command.data.name, command);

		if (developer) developerArray.push(command.data.toJSON());
		else commandsArray.push(command.data.toJSON());

		console.log(magenta('Commands') + ' ' + white('· Loaded') + ' ' + green(command.data.name + '.ts'));
	};

	client.application.commands.set(commandsArray);

	const developerGuild = client.guilds.cache.get(client.config.debug.devGuild);
	developerGuild.commands.set(developerArray);

	return console.log(magenta('Discord API') + ' ' + white('· Refreshed application commands for public and developer guilds.'));
}
