async function loadEco(client) {
	const { magenta, green, white } = require('chalk');
	const { fileLoad } = require('../../functions/fileLoader.js');

	const files = await fileLoad('events/economy');
	files.forEach((file) => {
		const event = require(file);
		const execute = (...args) => event.execute(...args, client);

		client.economy.on(event.name, execute);

		return console.log(magenta('Economy') + ' ' + white('· Loaded') + ' ' + green(event.name + '.js'));
	});
}

module.exports = { loadEco };
