import { EmbedBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { Evelyn } from '../../../structures/Evelyn';
import { Subcommand } from '../../../interfaces/interfaces';

const subCommand: Subcommand = {
	subCommand: "music.play",
	execute: async (interaction: ChatInputCommandInteraction, client: Evelyn) => {
		const { guild, options, channelId, user } = interaction;
		const member = interaction.member as GuildMember;
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
		const res = await client.manager.resolve({ query, requester: member });

		const player = client.manager.create({
			guildId: guild.id,
			voiceChannel: member.voice.channelId,
			textChannel: channelId,
			deaf: true,
		});

		//const musicUtils = new MusicUtils(interaction, player);
		//if (musicUtils.checkQuery(query)) return;

		switch (res.loadType) {
		case 'PLAYLIST_LOADED':
			player.connect();
			for (const track of res.tracks) player.queue.add(track);

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
			player.connect();
			player.queue.add(res.tracks[0]);

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
				.setThumbnail(res.tracks[0].info.image);
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

export default subCommand;