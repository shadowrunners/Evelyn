import { Evelyn } from "../Evelyn";
import { magenta, white, green } from 'chalk';
import { fileLoad } from '../../functions/fileLoader';

/** Loads music related events. */
export async function loadMusic(client: Evelyn) {
	const files = await fileLoad('events/automata');
	files.forEach((file) => {
		const event = require(file);
		const execute = (...args: any[]) => event.execute(...args, client);

		client.manager.on(event.name, execute);

		return console.log(
			magenta('Music') +
				' ' +
				white('· Loaded') +
				' ' +
				green(event.name + '.js'),
		);
	});
}
