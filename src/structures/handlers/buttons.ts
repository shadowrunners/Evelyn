import { magenta, white, green } from '@colors/colors';
import { fileLoad } from '../../functions/fileLoader.js';
import { Evelyn } from '../Evelyn.js';

/** Loads the buttons. */
export async function loadButtons(client: Evelyn) {
	const files = await fileLoad('buttons');
	for (const file of files) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const button = require(file).default;
		if (!button.id) return;

		client.buttons.set(button.id, button);

		console.log(
			`${magenta('Buttons')} ${white('· Loaded')} ${green(button.id + '.ts')}`,
		);
	}
}
