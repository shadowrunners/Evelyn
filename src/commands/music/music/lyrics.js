/* eslint-disable no-unused-vars */
const {
	Client,
	EmbedBuilder,
	ChatInputCommandInteraction,
} = require('discord.js');
const genius = require('genius-lyrics');
const MusicUtils = require('../../../modules/Utils/musicUtils.js');

module.exports = {
	subCommand: 'music.lyrics',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { guildId } = interaction;
		const gClient = new genius.Client(client.config.API.geniusKey);

		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const player = client.manager.players.get(guildId);
		const musicUtils = new MusicUtils(interaction, player);
		await interaction.deferReply();

		if (musicUtils.voiceCheck()) return;
		if (musicUtils.checkPlaying()) return;

		const track = player.queue.current;

		const trackTitle = track.title.replace(
			/(lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|\[.+\])/gi,
			'',
		);
		const actualTrack = await gClient.songs.search(trackTitle);
		const searches = actualTrack[0];
		const lyrics = await searches.lyrics();

		return interaction.editReply({
			embeds: [
				embed
					.setAuthor({
						name: `🔹 | Lyrics for ${trackTitle}`,
						url: searches.url,
					})
					.setDescription(lyrics)
					.setFooter({ text: 'Lyrics are powered by Genius.' }),
			],
		});
	},
};
