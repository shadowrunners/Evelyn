async function loadEvents(client) {
	const { magenta, white, green } = require('chalk');
	const { fileLoad } = require('../../functions/fileLoader.js');

	await client.events.clear();

	const files = await fileLoad('events');
	files.forEach((file) => {
		const event = require(file);
		const execute = (...args) => event.execute(...args, client);

		client.events.set(event.name, execute);

		if (event.rest) {
			if (event.once) client.rest.once(event.name, execute);
			else client.rest.on(event.name, execute);
		} else {
			if (event.once) client.once(event.name, execute);
			else client.on(event.name, execute);
		}

		return console.log(
			`${magenta('Events')} ${white('· Loaded')} ${green(`${event.name}.js`)}`,
		);
	});
}

module.exports = { loadEvents };
