const { magenta, white } = require('chalk');

module.exports = {
	name: 'nodeConnect',
	execute(node) {
		console.log(
			`${magenta('Lavalink')} ${white(`· Connected to node ${node.name}.`)}`,
		);
	},
};
