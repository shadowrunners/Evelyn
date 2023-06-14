import { Event } from '../../Interfaces/Interfaces';
import { Node } from '@shadowrunners/automata';
import colors from '@colors/colors';

const event: Event = {
	name: 'nodeError',
	execute(node: Node, error: Error) {
		console.log(
			`${colors.magenta('Lavalink')} ${colors.white(
				`· Node "${node.options.name}" has encountered an error: ${error.message}.`,
			)}`,
		);
	},
};

export default event;
