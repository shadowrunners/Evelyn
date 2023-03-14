import { Evelyn } from "../Evelyn";
import { magenta, green, white } from 'chalk';
import { fileLoad } from '../../functions/fileLoader';

/** Loads Statcord events. */
export async function loadStats(client: Evelyn) {
	const files = await fileLoad('events/statcord');
	for (const file of files) {
		const event = require(file);
		const execute = (...args: any[]) => event.execute(...args, client);

		client.statcord.once(event.name, execute);

		return console.log(
			magenta('Statcord') +
				' ' +
				white('· Loaded') +
				' ' +
				green(event.name + '.js'),
		);
	};
}
