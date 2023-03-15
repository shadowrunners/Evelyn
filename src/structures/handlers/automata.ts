import { Evelyn } from "../Evelyn";
import { magenta, white, green } from 'chalk';
import { fileLoad } from '../../functions/fileLoader';

/** Loads music related events. */
export async function loadMusic(client?: Evelyn) {
	const files = await fileLoad('Events/Automata');
	for (const file of files) {
		const event = require(file);
		const execute = (...args: any[]) => event.default.execute(...args, client);

		client.manager.on(event.default.name, execute);

		return console.log(`${magenta('Music')} ${white('· Loaded')} ${green(`${event.default.name}.ts`)}`);
	};
}
