/* eslint-disable no-unused-vars */
const {
	Client,
	EmbedBuilder,
	ChatInputCommandInteraction,
} = require('discord.js');

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

		if (!member.voice.channel) {
			return interaction.editReply({
				embeds: [
					embed.setDescription(
						'🔹 | You need to be in a voice channel to use this command.',
					),
				],
			});
		}

		const player = await client.manager.createPlayer({
			guildId: guild.id,
			voiceId: member.voice.channelId,
			textId: channelId,
			deaf: true,
		});

		const query = options.getString('query');
		const res = await player.search(query, { requester: user });

		switch (res.type) {
			case "PLAYLIST":
				const tracks = res.tracks;
				for (const track of tracks) player.queue.add(track);

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

			case "TRACK": case "SEARCH":
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

				if (player.queue.totalSize > 1) {
					embed.addFields({
						name: 'Position in queue',
						value: `${player.queue.size - 0}`,
						inline: true,
					});
				}
				return interaction.editReply({ embeds: [embed] });

			case "default":
				if (player) player?.destroy();

				return interaction.editReply({
					embeds: [embed.setDescription('🔹 | No matches found.')],
				});
		}
	},
};
