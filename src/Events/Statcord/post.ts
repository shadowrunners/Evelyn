import { Event } from '../../interfaces/interfaces.js';
import { magenta, white, red } from '@colors/colors';

const event: Event = {
	name: 'post',
	once: true,
	execute(status: string) {
		if (!status)
			console.log(
				`${magenta('Statcord')} ${white('·')} ${magenta('Evelyn')} ${white(
					'has successfully posted.',
				)}`,
			);
		else
			console.info(
				`${magenta('Statcord')} ${white('·')} ${red(
					`Evelyn has failed to post. Outputting debug info: ${status}`,
				)}`,
			);
	},
};

export default event;
