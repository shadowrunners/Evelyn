async function loadStats(client) {
	const { magenta, white, green } = require('chalk');
	const { fileLoad } = require('../../functions/fileLoader.js');

	const files = await fileLoad('events/statcord');
	files.forEach((file) => {
		const event = require(file);
		const execute = (...args) => event.execute(...args, client);

		client.statcord.once(event.name, execute);

		return console.log(
			`${magenta('Statcord')} ${white('· Loaded')} ${green(`${event.name}.js`)}`,
		);
	});
}

module.exports = { loadStats };
