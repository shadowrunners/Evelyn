const { magenta, green, white } = require('chalk');
const { fileLoad } = require('../../functions/fileLoader.js');

async function loadCommands(client) {
	await client.commands.clear();
	await client.subCommands.clear();

	const commandsArray = [];
	const developerArray = [];

	const files = await fileLoad('commands');
	for (const file of files) {
		const command = require(file);
		const { subCommand, developer, data } = command;

		if (subCommand) return client.subCommands.set(subCommand, command);
		client.commands.set(data.name, command);

		if (developer) developerArray.push(data.toJSON());
		else commandsArray.push(data.toJSON());

		console.log(
			magenta('Commands') +
				' ' +
				white('· Loaded') +
				' ' +
				green(data.name + '.js'),
		);
	}

	await client.application.commands.set(commandsArray);
	const developerGuild = client.guilds.cache.get(client.config.debug.devGuild);
	await developerGuild.commands.set(developerArray);

	return console.info(
		magenta('Discord API') +
			' ' +
			white('· Refreshed application commands for public and developer guilds.'),
	);
}

module.exports = { loadCommands };
