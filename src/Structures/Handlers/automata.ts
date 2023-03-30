import { Evelyn } from '../Evelyn.js';
import { magenta, white, green } from '@colors/colors';
import { fileLoad } from '../../functions/fileLoader.js';

/** Loads music related events. */
export async function loadMusic(client?: Evelyn) {
	const files = await fileLoad('Events/Automata');
	for (const file of files) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const event = require(file).default;
		const execute = (...args: any[]) => event.execute(...args, client);

		client.manager.on(event.name, execute);

		return console.log(
			`${magenta('Music')} ${white('· Loaded')} ${green(`${event.name}.ts`)}`,
		);
	}
}
