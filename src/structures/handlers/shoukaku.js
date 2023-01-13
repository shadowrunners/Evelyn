async function loadShoukaku(client) {
	const { magenta, white, green } = require('chalk');
	const { fileLoad } = require('../../functions/fileLoader.js');

	const files = await fileLoad('events/shoukaku');
	files.forEach((file) => {
		const event = require(file);
		const execute = (...args) => event.execute(...args, client);

		if (event.shoukaku) client.manager.shoukaku.on(event.name, execute);
		else client.manager.on(event.name, execute);

		return console.log(
			`${magenta('Shoukaku')} ${white('· Loaded')} ${green(`${event.name}.js`)}`,
		);
	});
}

module.exports = { loadShoukaku };
