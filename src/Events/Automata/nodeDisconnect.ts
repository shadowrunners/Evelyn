import { Node } from '@shadowrunners/automata';
import colors from '@colors/colors';

export default class NodeDisconnect {
	name = 'nodeDisconnect';

	execute(node: Node) {
		console.log(
			`${colors.magenta('Lavalink')} ${colors.white(
				`· Lost connection to node ${node.options.name}.`,
			)}`,
		);
	}
}
