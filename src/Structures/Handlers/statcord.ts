import { Evelyn } from '../Evelyn.js';
import { magenta, green, white } from '@colors/colors';
import { fileLoad } from '../../functions/fileLoader.js';

/** Loads Statcord events. */
export async function loadStats(client: Evelyn) {
	const files = await fileLoad('events/statcord');
	for (const file of files) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const event = require(file).default;
		const execute = (...args: any[]) => event.execute(...args, client);

		client.statcord.once(event.name, execute);

		return console.log(
			`${magenta('Statcord')} ${white('· Loaded')} ${green(event.name + '.ts')}`,
		);
	}
}
