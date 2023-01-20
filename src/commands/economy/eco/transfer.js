/* eslint-disable no-unused-vars */
const { Client, ChatInputCommandInteraction } = require('discord.js');
const ecoEngine = require('../../../modules/Engines/economyEngine.js');

module.exports = {
	subCommand: 'eco.transfer',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { options } = interaction;
		const target = options.getUser('target');
		const amount = options.getNumber('amount');
		const EcoEngine = new ecoEngine(interaction, client);

		await interaction.deferReply();

		return EcoEngine.transfer(target, amount);
	},
};
