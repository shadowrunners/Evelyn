import { Event } from '../../interfaces/interfaces.js';
import { Node } from '@shadowrunners/automata';
import { magenta, white } from '@colors/colors';

const event: Event = {
	name: 'nodeDisconnect',
	execute(node: Node) {
		console.log(
			`${magenta('Lavalink')} ${white(
				`· Lost connection to node ${node.name}.`,
			)}`,
		);
	},
};

export default event;
