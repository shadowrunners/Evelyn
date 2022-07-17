const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs');
const path = require('path');
const { token, clientID } = require('./config.json');
const { magenta, white } = require("chalk");

const commands = [];

readdirSync("./src/commands/").map(async dir => {
	readdirSync(`./src/commands/${dir}/`).map(async (cmd) => {
		commands.push(require(path.join(__dirname, `../commands/${dir}/${cmd}`)))
	});
});

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
	try {
		console.log(magenta("[Discord API] ") + white("Started refreshing application (/) commands."));
		await rest.put(
			Routes.applicationCommands(clientID),
			{ body: commands },
		);
		console.log(magenta("[Discord API] ") + white("Finished refreshing application commands."));
	} catch (error) {
		console.error(error);
	}
})();