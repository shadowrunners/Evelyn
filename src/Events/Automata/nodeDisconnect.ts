import { Event } from '../../interfaces/interfaces';
import { Node } from '@shadowrunners/automata';
import colors from '@colors/colors';

const event: Event = {
	name: 'nodeDisconnect',
	execute(node: Node) {
		console.log(
			`${colors.magenta('Lavalink')} ${colors.white(
				`· Lost connection to node ${node.options.name}.`,
			)}`,
		);
	},
};

export default event;
