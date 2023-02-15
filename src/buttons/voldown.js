// eslint-disable-next-line no-unused-vars
const { ButtonInteraction, Client } = require('discord.js');
const MusicUtils = require('../modules/Utils/musicUtils.js');

module.exports = {
	id: 'voldown',
	/**
	 * @param {ButtonInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { guildId } = interaction;

		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);
		const volume = player.volume - 10;

		await interaction.deferReply();

		if (musicUtils.check(['voiceCheck'])) return;

		return musicUtils.setVolume(volume);
	},
};
