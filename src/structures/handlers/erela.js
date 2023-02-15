async function loadMusic(client) {
	const { magenta, white, green } = require('chalk');
	const { fileLoad } = require('../../functions/fileLoader.js');

	const files = await fileLoad('events/erela');
	files.forEach((file) => {
		const event = require(file);
		const execute = (...args) => event.execute(...args, client);

		client.manager.on(event.name, execute);

		return console.log(
			magenta('Music') +
				' ' +
				white('· Loaded') +
				' ' +
				green(event.name + '.js'),
		);
	});
}

module.exports = { loadMusic };
