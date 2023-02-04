const {
	// eslint-disable-next-line no-unused-vars
	Client,
	EmbedBuilder,
	// eslint-disable-next-line no-unused-vars
	ChatInputCommandInteraction,
} = require('discord.js');
const MusicUtils = require('../../../modules/Utils/musicUtils.js');

module.exports = {
	subCommand: 'music.clear',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { guildId } = interaction;

		const embed = new EmbedBuilder().setColor('Blurple');
		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);

		await interaction.deferReply();

		if (musicUtils.check(["voiceCheck", "checkQueue"])) return;
		player.queue.clear();

		return interaction.editReply({
			embeds: [embed.setDescription('🔹 | Queue cleared.')],
		});
	},
};
