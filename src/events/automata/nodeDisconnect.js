const { magenta, white } = require('chalk');

module.exports = {
	name: 'nodeDisconnect',
	execute(node) {
		console.log(
			`${magenta('Lavalink')} ${white(
				`· Lost connection to node ${node.name}.`,
			)}`,
		);
	},
};
