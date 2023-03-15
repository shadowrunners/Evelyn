import { Evelyn } from '../Evelyn.js';
import { magenta, green, white } from '@colors/colors';
import { fileLoad } from '../../functions/fileLoader.js';

/** Loads all modals. */
export async function loadModals(client: Evelyn) {
	const files = await fileLoad('modals');
	for (const file of files) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const modal = require(file);
		if (!modal.id) return;

		client.modals.set(modal.id, modal);

		return console.log(
			`${magenta('Modals')} ${white('· Loaded')} ${green(modal.id + '.js')}}`,
		);
	}
}
