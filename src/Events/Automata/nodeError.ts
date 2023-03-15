import { Event } from '../../interfaces/interfaces.js';
import { Node } from '@shadowrunners/automata';
import { magenta, white } from '@colors/colors';

const event: Event = {
	name: 'nodeError',
	execute(node: Node, error: Error) {
		console.log(
			`${magenta('Lavalink')} ${white(
				`· Node "${node.name}" has encountered an error: ${error.message}.`,
			)}`,
		);
	},
};

export default event;
