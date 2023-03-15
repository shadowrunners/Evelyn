import { Event } from '../../interfaces/interfaces';
import { Node } from '@shadowrunners/automata';
import { magenta, white } from 'chalk';

const event: Event = {
	name: 'nodeConnect',
	execute(node: Node) {
		console.log(
			`${magenta('Lavalink')} ${white(`· Connected to node ${node.name}.`)}`,
		);
	},
};

export default event;