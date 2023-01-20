// eslint-disable-next-line no-unused-vars
const { Client, ChatInputCommandInteraction } = require('discord.js');
const ecoEngine = require('../../../modules/Engines/economyEngine.js');

module.exports = {
	subCommand: 'eco.withdraw',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { options } = interaction;
		const amount = options.getNumber('amount');
		const EcoEngine = new ecoEngine(interaction, client);

		await interaction.deferReply();

		return EcoEngine.withdraw(amount);
	},
};
