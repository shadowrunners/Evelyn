// eslint-disable-next-line no-unused-vars
const { ButtonInteraction, EmbedBuilder, Client } = require('discord.js');
const MusicUtils = require('../modules/Utils/musicUtils.js');

module.exports = {
	id: 'pause',
	/**
	 * @param {ButtonInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { guildId, user } = interaction;

		const player = client.manager.players.get(guildId);
		const utils = new MusicUtils(interaction, player);
		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setTimestamp()
			.setFooter({
				text: `Action executed by ${user.username}.`,
				iconURL: user.avatarURL({ dynamic: true }),
			});

		if (utils.check()) return;

		await interaction.deferReply();

		if (!player.paused) {
			player.pause(true);
			return interaction.editReply({
				embeds: [embed.setDescription('🔹 | Paused.')],
			});
		}

		if (player.paused) {
			player.pause(false);

			return interaction.editReply({
				embeds: [embed.setDescription('🔹 | Resumed.')],
			});
		}
	},
};
