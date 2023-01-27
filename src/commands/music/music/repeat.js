/* eslint-disable no-unused-vars */
const { ChatInputCommandInteraction, Client } = require('discord.js');
const MusicUtils = require('../../../modules/Utils/musicUtils.js');

module.exports = {
	subCommand: 'music.repeat',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { options, guildId } = interaction;
		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);
		await interaction.deferReply();

		if (musicUtils.check(["voiceCheck"])) return;

		switch (options.getString('type')) {
			case 'queue':
				return musicUtils.repeatMode('queue');
			case 'song':
				return musicUtils.repeatMode('song');
			case 'off':
				return musicUtils.repeatMode('off');
			default:
				break;
		}
	},
};
