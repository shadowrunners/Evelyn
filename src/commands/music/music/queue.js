/* eslint-disable no-unused-vars */
const {
	ChatInputCommandInteraction,
	Client,
	EmbedBuilder,
} = require('discord.js');
const MusicUtils = require('../../../modules/Utils/musicUtils.js');
const utils = require('../../../modules/Utils/utils.js');

module.exports = {
	subCommand: 'music.queue',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const util = new utils(interaction);
		const { guild, guildId } = interaction;
		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);
		await interaction.deferReply();

		if (musicUtils.check(['voiceCheck', 'checkPlaying', 'checkQueue'])) return;

		const embeds = [];
		const songs = [];

		for (let i = 0; i < player.queue.length; i++) {
			songs.push(
				`${i + 1}. [${player.queue[i].title}](${player.queue[i].uri}) [${
					player.queue[i].requester
				}]`,
			);
		}

		for (let i = 0; i < songs.length; i += 10) {
			const embed = new EmbedBuilder().setColor('Blurple');

			embed
				.setAuthor({ name: `Current queue for ${guild.name}` })
				.setTitle(`▶️ | Currently playing: ${player.currentTrack.info.title}`)
				.setDescription(songs.slice(i, i + 10).join('\n'))
				.setTimestamp(),
			embeds.push(embed);
		}

		return util.embedPages(embeds);
	},
};
