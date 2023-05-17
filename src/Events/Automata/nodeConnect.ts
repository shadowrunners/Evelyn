import { Event } from '../../interfaces/interfaces';
import { Node } from '@shadowrunners/automata';
import colors from '@colors/colors';

const event: Event = {
	name: 'nodeConnect',
	execute(node: Node) {
		console.log(
			`${colors.magenta('Lavalink')} ${colors.white(
				`· Connected to node ${node.options.name}.`,
			)}`,
		);
	},
};

export default event;
