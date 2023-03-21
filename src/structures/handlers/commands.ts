import { Evelyn } from '../Evelyn.js';
import { magenta, green, white } from '@colors/colors';
import { fileLoad } from '../../functions/fileLoader.js';

/** Loads the commands. */
export async function loadCommands(client: Evelyn) {
	const commandsArray = [];
	const developerArray = [];

	const files = await fileLoad('Commands');
	for (const file of files) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const command = require(file).default;

		if (command.subCommand) client.subCommands.set(command.subCommand, command);
		else {
			client.commands.set(command.data.name, command);

			if (command.developer) developerArray.push(command.data.toJSON());
			else commandsArray.push(command.data.toJSON());

			console.log(
				`${magenta('Commands')} ${white('· Loaded')} ${green(
					command.data.name + '.ts',
				)}`,
			);
		}
	}

	client.application.commands.set(commandsArray);

	const developerGuild = client.guilds.cache.get(client.config.debug.devGuild);
	developerGuild.commands.set(developerArray);

	console.log(
		`${magenta('Discord API')} ${white(
			'· Refreshed application commands for public and developer guilds.',
		)}`,
	);
}
