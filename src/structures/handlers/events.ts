import { magenta, green, white } from 'chalk';
import { fileLoad } from '../../functions/fileLoader';

/** Loads all of the events. */
export async function loadEvents(client) {
	await client.events.clear();

	const files = await fileLoad('events');
	files.forEach((file) => {
		const eventFile = require(file);
		const { event } = eventFile;
		const execute = (...args: any[]) => event.execute(...args, client);

		client.events.set(event.name, execute);

		if (event.rest) {
			if (event.once) client.rest.once(event.name, execute);
			else client.rest.on(event.name, execute);
		}
		else {
			// eslint-disable-next-line no-lonely-if
			if (event.once) client.once(event.name, execute);
			else client.on(event.name, execute);
		}

		return console.log(
			magenta('Events') +
				' ' +
				white('· Loaded') +
				' ' +
				green(event.name + '.ts'),
		);
	});
}