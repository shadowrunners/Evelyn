import { Node } from '@shadowrunners/automata';
import colors from '@colors/colors';

export default class NodeConnect {
	name = 'nodeConnect';

	execute(node: Node) {
		console.log(
			`${colors.magenta('Lavalink')} ${colors.white(
				`· Connected to node ${node.options.name}.`,
			)}`,
		);
	}
}
