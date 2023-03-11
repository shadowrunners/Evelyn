/* eslint-disable no-unused-vars */
const { ChatInputCommandInteraction, Client } = require('discord.js');
const MusicUtils = require('../../../modules/Utils/musicUtils.js');

module.exports = {
	subCommand: 'music.filters',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { options, guildId } = interaction;
		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);
		await interaction.deferReply();

		if (musicUtils.check(['voiceCheck', 'checkPlaying'])) return;

		switch (options.getString('option')) {
		case '3d':
			return musicUtils.filters('3d');
		case 'bassboost':
			return musicUtils.filters('bassboost');
		case 'karaoke':
			return musicUtils.filters('karaoke');
		case 'nightcore':
			return musicUtils.filters('nightcore');
		case 'slowmo':
			return musicUtils.filters('slowmo');
		case 'soft':
			return musicUtils.filters('soft');
		case 'tv':
			return musicUtils.filters('tv');
		case 'treblebass':
			return musicUtils.filters('treblebass');
		case 'vaporwave':
			return musicUtils.filters('vaporwave');
		case 'vibrato':
			return musicUtils.filters('vibrato');
		case 'reset':
			return musicUtils.filters('reset');
		default:
			break;
		}
	},
};
