// eslint-disable-next-line no-unused-vars
const { Client, ChatInputCommandInteraction } = require('discord.js');
const ecoEngine = require('../../../modules/Engines/economyEngine.js');

module.exports = {
	subCommand: 'eco.balance',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { options } = interaction;
		const EcoEngine = new ecoEngine(interaction, client);
		const target = options.getUser('target') || interaction.user;

		await interaction.deferReply();

		return EcoEngine.balance(target);
	},
};
