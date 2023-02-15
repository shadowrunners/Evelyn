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

		const player = await client.manager.create({
			region: member.voice.channel?.rtcRegion || undefined,
			guild: guild.id,
			voiceChannel: member.voice.channelId,
			textChannel: channelId,
			selfDeafen: true,
		});

		const musicUtils = new MusicUtils(interaction, player);
		const query = options.getString('query');

		if (musicUtils.checkQuery(query)) return;

		const res = await player.search(query, user);

		switch (res.loadType) {
		case 'PLAYLIST_LOADED':
			player.connect();
			player.queue.add(res.tracks);

			if (
				!player.playing &&
					!player.paused &&
					player.queue.totalSize === res.tracks.length
			)
				player.play();

			return interaction.editReply({
				embeds: [
					embed
						.setAuthor({
							name: 'Playlist added to the queue',
							iconURL: user.avatarURL(),
						})
						.setDescription(`**[${res.playlistName}](${query})**`)
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
			player.connect();
			player.queue.add(res.tracks[0]);

			if (!player.playing && !player.paused && !player.queue.size)
				player.play();

			embed
				.setAuthor({
					name: 'Added to the queue',
					iconURL: user.avatarURL(),
				})
				.setDescription(`**[${res.tracks[0].title}](${res.tracks[0].uri})** `)
				.addFields({
					name: 'Queued by',
					value: `${member}`,
					inline: true,
				})
				.setThumbnail(res.tracks[0].thumbnail);
			await interaction.editReply({ embeds: [embed] });

			if (player.queue.totalSize > 1)
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
