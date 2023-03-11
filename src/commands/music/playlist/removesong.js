// eslint-disable-next-line no-unused-vars
const { ChatInputCommandInteraction } = require('discord.js');
const importEngine = require('../../../modules/Engines/playlistEngine.js');

module.exports = {
	subCommand: 'playlist.removesong',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { options } = interaction;
		const pName = options.getString('name');
		const song = options.getNumber('songid');
		const PlaylistEngine = new importEngine(interaction);

		await interaction.deferReply();

		return PlaylistEngine.removeThisSong(pName, song);
	},
};
