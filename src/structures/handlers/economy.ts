import { Evelyn } from '../Evelyn';
import { magenta, green, white } from 'chalk';
import { fileLoad } from '../../functions/fileLoader';

/** Loads economy events. */
export async function loadEco(client: Evelyn) {
	const files = await fileLoad('events/economy');
	for (const file of files) {
		const event = require(file);
		const execute = (...args: any[]) => event.execute(...args, client);

		client.economy.on(event.name, execute);

		return console.log(
			magenta('Economy') +
				' ' +
				white('· Loaded') +
				' ' +
				green(event.name + '.js')
		);
	};
}
