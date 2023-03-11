// eslint-disable-next-line no-unused-vars
const { ChatInputCommandInteraction } = require('discord.js');
const importEngine = require('../../../modules/Engines/playlistEngine.js');

module.exports = {
	subCommand: 'playlist.delete',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { options } = interaction;
		const pName = options.getString('name');
		const PlaylistEngine = new importEngine(interaction);

		await interaction.deferReply();

		return PlaylistEngine.delete(pName);
	},
};
