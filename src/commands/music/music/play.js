/* eslint-disable no-unused-vars */
const {
	Client,
	EmbedBuilder,
	ChatInputCommandInteraction,
} = require('discord.js');
const MusicUtils = require('../../../modules/Utils/musicUtils.js');

module.exports = {
	subCommand: 'music.play',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { guild, options, member, channelId, user } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');

		await interaction.deferReply();

		if (!member.voice.channel)
			return interaction.editReply({
				embeds: [
					embed.setDescription(
						'🔹 | You need to be in a voice channel to use this command.',
					),
				],
			});

		const query = options.getString('query');
		const res = await client.manager.resolve(query, 'dzsearch');

		const player = await client.manager.create({
			guildId: guild.id,
			voiceChannel: member.voice.channelId,
			textChannel: channelId,
			selfDeafen: true,
			noReplace: false,
		});

		const musicUtils = new MusicUtils(interaction, player);
		if (musicUtils.checkQuery(query)) return;

		switch (res.loadType) {
		case 'PLAYLIST_LOADED':
			// eslint-disable-next-line no-case-declarations
			const tracks = res.tracks;
			player.queue.add(tracks);
			track.info.requester = user;

			if (
				!player.isPlaying &&
					!player.isPaused &&
					player.queue.size === res.tracks.length
			)
				player.play();

			return interaction.editReply({
				embeds: [
					embed
						.setAuthor({
							name: 'Playlist added to the queue',
							iconURL: user.avatarURL(),
						})
						.setDescription(`**[${res.playlistInfo.name}](${query})**`)
						.addFields(
							{
								name: 'Added',
								value: `\`${res.tracks.length}\` tracks`,
								inline: true,
							},
							{
								name: 'Queued by',
								value: `${member}`,
								inline: true,
							},
						),
				],
			});

		case 'SEARCH_RESULT':
		case 'TRACK_LOADED':
			// eslint-disable-next-line no-case-declarations
			const track = res.tracks[0];
			track.info.requester = user;
			player.queue.add(track);

			if (!player.isPlaying && player.isConnected) player.play();

			embed
				.setAuthor({
					name: 'Added to the queue',
					iconURL: user.avatarURL(),
				})
				.setDescription(
					`**[${res.tracks[0].info.title}](${res.tracks[0].info.uri})** `,
				)
				.addFields({
					name: 'Queued by',
					value: `${member}`,
					inline: true,
				})
				.setThumbnail(res.tracks[0].info.thumbnail);
			await interaction.editReply({ embeds: [embed] });

			if (player.queue.size > 1)
				embed.addFields({
					name: 'Position in queue',
					value: `${player.queue.size - 0}`,
					inline: true,
				});
			return interaction.editReply({ embeds: [embed] });

		case 'NO_MATCHES':
		case 'LOAD_FAILED':
			if (player) player?.destroy();

			return interaction.editReply({
				embeds: [embed.setDescription('🔹 | No matches found.')],
			});

		default:
			break;
		}
	},
};
