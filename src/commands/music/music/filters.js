/* eslint-disable no-unused-vars */
const { ChatInputCommandInteraction, Client } = require('discord.js');
const MusicUtils = require('../../../functions/musicUtils.js');

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

		if (musicUtils.voiceCheck()) return;
		if (musicUtils.checkPlaying()) return;

		switch (options.getString('type')) {
		case '3d':
			return musicUtils.filters('3d');
		case 'bass':
			return musicUtils.filters('bass');
		case 'bassboost':
			return musicUtils.filters('bassboost');
		case 'nightcore':
			return musicUtils.filters('nightcore');
		case 'pop':
			return musicUtils.filters('pop');
		case 'slowmo':
			return musicUtils.filters('slowmo');
		case 'soft':
			return musicUtils.filters('soft');
		case 'tv':
			return musicUtils.filters('tv');
		case 'treblebass':
			return musicUtils.filters('treblebass');
		case 'tremolo':
			return musicUtils.filters('tremolo');
		case 'vaporwave':
			return musicUtils.filters('vaporwave');
		case 'vibrate':
			return musicUtils.filters('vibrate');
		case 'vibrato':
			return musicUtils.filters('vibrato');
		case 'reset':
			return musicUtils.filters('reset');
		default:
			break;
		}
	},
};
