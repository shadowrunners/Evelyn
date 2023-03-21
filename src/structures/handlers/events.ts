import { magenta, green, white } from '@colors/colors';
import { fileLoad } from '../../functions/fileLoader.js';
import { Event } from '../../interfaces/interfaces.js';
import { Evelyn } from '../Evelyn.js';

/** Loads all of the events. */
export async function loadEvents(client: Evelyn) {
	const files = await fileLoad('events');
	for (const file of files) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const event: Event = require(file).default;
		console.log(event);
		const execute = (...args: any[]) => event.execute(...args, client);

		if (event.rest) {
			if (event.once) client.rest.once(event.name, execute);
			else client.rest.on(event.name, execute);
		}
		else {
			// eslint-disable-next-line no-lonely-if
			if (event.once) client.once(event.name, execute);
			else client.on(event.name, execute);
		}

		console.log(
			magenta('Events') +
				' ' +
				white('· Loaded') +
				' ' +
				green(event.name + '.ts'),
		);
	}
}
