const { magenta, white, green } = require('chalk');
const { fileLoad } = require('../../functions/fileLoader.js');

async function loadEvents(client) {
	client.events = new Map();

	const files = await fileLoad('events');
	for (const file of files) {
		const event = require(file);
		const execute = (...args) => event.execute(...args, client);
		const target = event.rest ? client.rest : client;

		target[event.once ? 'once' : 'on'](event.name, execute);
		client.events.set(event.name, execute);

		console.log(
			magenta('Events') +
				' ' +
				white('· Loaded') +
				' ' +
				green(event.name + '.js'),
		);
	}
}

module.exports = { loadEvents };
