/* eslint-disable no-unused-vars */
const {
	Client,
	EmbedBuilder,
	ChatInputCommandInteraction,
} = require('discord.js');
const MusicUtils = require('../../../modules/Utils/musicUtils.js');

module.exports = {
	subCommand: 'music.skip',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { guildId } = interaction;

		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);

		await interaction.deferReply();

		if (musicUtils.voiceCheck()) return;
		if (musicUtils.checkQueue()) return;

		await player.stop();

		return interaction.editReply({
			embeds: [embed.setDescription('🔹 | Skipped.')],
		});
	},
};
