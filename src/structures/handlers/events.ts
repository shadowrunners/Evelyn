import { magenta, green, white } from '@colors/colors';
import { fileLoad } from '../../functions/fileLoader.js';

/** Loads all of the events. */
export async function loadEvents(client) {
	await client.events.clear();

	const files = await fileLoad('events');
	files.forEach((file) => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const event = require(file);
		const execute = (...args: any[]) => event.default.execute(...args, client);

		client.events.set(event.default.name, execute);

		if (event.rest) {
			if (event.once) client.rest.once(event.default.name, execute);
			else client.rest.on(event.default.name, execute);
		}
		else {
			// eslint-disable-next-line no-lonely-if
			if (event.once) client.once(event.default.name, execute);
			else client.on(event.default.name, execute);
		}

		return console.log(
			magenta('Events') +
				' ' +
				white('· Loaded') +
				' ' +
				green(event.default.name + '.ts'),
		);
	});
}
