// eslint-disable-next-line no-unused-vars
const { ButtonInteraction, Client } = require('discord.js');
const MusicUtils = require('../functions/musicUtils.js');

module.exports = {
	id: 'volup',
	/**
	 * @param {ButtonInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { guildId } = interaction;

		const player = client.manager.players.get(guildId);
		const volume = Number(player.volume * 100) + 10;
		const utils = new MusicUtils(interaction, player);

		await interaction.deferReply();

		if (utils.check()) return;

		return utils.setVolume(volume);
	},
};
