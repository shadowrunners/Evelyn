/* eslint-disable no-unused-vars */
const {
	ChatInputCommandInteraction,
	Client,
	EmbedBuilder,
} = require('discord.js');
const MusicUtils = require('../../../modules/Utils/musicUtils.js');

module.exports = {
	subCommand: 'music.nowplaying',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { user, guildId } = interaction;

		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);
		const embed = new EmbedBuilder().setColor('Blurple');

		await interaction.deferReply();

		if (musicUtils.check(['voiceCheck', 'checkPlaying'])) return;
		const track = player.queue.current;

		return interaction.editReply({
			embeds: [
				embed
					.setAuthor({
						name: 'Now Playing',
						iconURL: user.avatarURL(),
					})
					.setDescription(
						`**[${track.title}](${track.uri})** [${track.requester}]`,
					),
			],
		});
	},
};
