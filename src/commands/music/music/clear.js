/* eslint-disable no-unused-vars */
const {
	Client,
	EmbedBuilder,
	ChatInputCommandInteraction,
} = require('discord.js');
const MusicUtils = require('../../../functions/musicUtils.js');

module.exports = {
	subCommand: 'music.clear',
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
		player.queue.clear();

		return interaction.editReply({
			embeds: [embed.setDescription('🔹 | Queue cleared.')],
		});
	},
};
