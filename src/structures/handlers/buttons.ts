import { magenta, white, green } from 'chalk';
import { fileLoad } from '../../functions/fileLoader';
import { Evelyn } from '../Evelyn';

/** Loads the buttons. */
export async function loadButtons(client: Evelyn) {
	const files = await fileLoad('buttons');
	for (const file of files) {
		const button = require(file);
		if (!button.id) return;

		client.buttons.set(button.id, button);

		return console.log(
			magenta('Buttons') +
			' ' +
			white('· Loaded') +
			' ' +
			green(button.id + '.js')
		);
	}
}
