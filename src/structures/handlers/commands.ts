import { Evelyn } from "../Evelyn";
import { magenta, green, white } from 'chalk';
import { fileLoad } from '../../functions/fileLoader';

/** Loads the commands. */
export async function loadCommands(client: Evelyn) {
	const commandsArray = [];
	const developerArray = [];

	const files = await fileLoad('Commands');
	files.forEach((file) => {
		const command = require(file);

		if (command.default.subCommand) return client.subCommands.set(command.default.subCommand, command.default);
		client.commands.set(command.default.data.name, command);

		if (command.developer) developerArray.push(command.default.data.toJSON());
		else commandsArray.push(command.default.data.toJSON());

		console.log(magenta('Commands') + ' ' + white('· Loaded') + ' ' + green(command.default.data.name + '.ts'));
	});

	console.log(client.subCommands)


	client.application.commands.set(commandsArray);

	const developerGuild = client.guilds.cache.get(client.config.debug.devGuild);
	developerGuild.commands.set(developerArray);

	return console.log(magenta('Discord API') + ' ' + white('· Refreshed application commands for public and developer guilds.'));
}
