import { Evelyn } from '../Evelyn.js';
import { magenta, green, white } from '@colors/colors';
import { fileLoad } from '../../functions/fileLoader.js';

/** Loads economy events. */
export async function loadEco(client: Evelyn) {
	const files = await fileLoad('events/economy');
	for (const file of files) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const event = require(file).default;
		const execute = (...args: any[]) => event.execute(...args, client);

		client.economy.on(event.name, execute);

		return console.log(
			magenta('Economy') +
				' ' +
				white('· Loaded') +
				' ' +
				green(event.name + '.js'),
		);
	}
}
