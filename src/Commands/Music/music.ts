import {
	EmbedBuilder,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	GuildMember,
	ButtonInteraction,
} from 'discord.js';
import {
	Discord,
	Slash,
	SlashGroup,
	SlashOption,
	SlashChoice,
	ButtonComponent,
} from 'discordx';
import { MusicUtils } from '../../Modules/Utils/musicUtils.js';
import { Util } from '../../Modules/Utils/utils.js';
import { Player } from '@shadowrunners/automata';
import { Evelyn } from '../../Evelyn.js';
import { Client } from 'genius-lyrics';

@Discord()
@SlashGroup({
	description: 'A complete music system.',
	name: 'music',
})
@SlashGroup('music')
export class Music {
	private player: Player | undefined;
	private musicUtils: MusicUtils;
	private embed: EmbedBuilder;
	private util: Util;

	constructor() {
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
	}

	@Slash({
		description: 'Plays a song.',
		name: 'play',
	})
	async play(
		@SlashOption({
			name: 'query',
			description: 'Provide the name of the song or URL.',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
			query: string,
			interaction: ChatInputCommandInteraction,
			client: Evelyn,
	) {
		const { guild, channelId, user } = interaction;
		const member = interaction.member as GuildMember;

		await interaction.deferReply();

		if (!member.voice.channel)
			return interaction.editReply({
				embeds: [
					this.embed.setDescription(
						'🔹 | You need to be in a voice channel to use this command.',
					),
				],
			});

		const res = await client.manager.resolve({ query, requester: member });

		this.player = client.manager.create({
			guildId: guild.id,
			voiceChannel: member.voice.channelId,
			textChannel: channelId,
			deaf: true,
		});

		this.musicUtils = new MusicUtils(interaction, this.player);
		if (this.musicUtils.checkQuery(query)) return;

		switch (res.loadType) {
		case 'PLAYLIST_LOADED':
			this.player.connect();
			for (const track of res.tracks) this.player.queue.add(track);

			if (
				!this.player.isPlaying &&
					!this.player.isPaused &&
					this.player.queue.size === res.tracks.length
			)
				this.player.play();

			return interaction.editReply({
				embeds: [
					this.embed
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
			this.player.connect();
			this.player.queue.add(res.tracks[0]);

			if (!this.player.isPlaying && this.player.isConnected)
				this.player.play();

			this.embed
				.setAuthor({
					name: 'Added to the queue',
					iconURL: user.avatarURL(),
				})
				.setDescription(`**[${res.tracks[0].title}](${res.tracks[0].uri})** `)
				.addFields({
					name: 'Queued by',
					value: `${member}`,
					inline: true,
				});
			await interaction.editReply({ embeds: [this.embed] });

			if (this.player.queue.size > 1)
				this.embed.addFields({
					name: 'Position in queue',
					value: `${this.player.queue.size - 0}`,
					inline: true,
				});
			return interaction.editReply({ embeds: [this.embed] });

		case 'NO_MATCHES':
		case 'LOAD_FAILED':
			if (this.player) this.player?.destroy();

			return interaction.editReply({
				embeds: [this.embed.setDescription('🔹 | No matches found.')],
			});

		default:
			break;
		}
	}

	@Slash({
		description: 'Alters the volume.',
		name: 'volume',
	})
	async volume(
		@SlashOption({
			name: 'percent',
			description: 'Provide the name of the song or URL.',
			required: true,
			type: ApplicationCommandOptionType.Number,
		})
			percent: number,
	) {
		if (this.musicUtils.check(['voiceCheck'])) return;
		return this.musicUtils.setVolume(percent);
	}

	@Slash({
		description: 'Skip to a specific time in the song.',
		name: 'seek',
	})
	async seek(
		@SlashOption({
			name: 'time',
			description: 'Provide the timestamp.',
			required: true,
			type: ApplicationCommandOptionType.Number,
		})
			time: number,
	) {
		if (this.musicUtils.check(['voiceCheck', 'checkPlaying'])) return;
		return this.musicUtils.seek(time);
	}

	@Slash({
		description: 'Repeat the current song or queue.',
		name: 'repeat',
	})
	async repeat(
		@SlashChoice({ name: '🔹 | Queue', value: 'queue' })
		@SlashChoice({ name: '🔹 | Track', value: 'track' })
		@SlashChoice({ name: '🔹 | None', value: 'none' })
		@SlashOption({
			name: 'type',
			description: 'Select the loop type.',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
			type: string,
	) {
		if (this.musicUtils.check(['voiceCheck'])) return;

		switch (type) {
		case 'queue':
			return this.musicUtils.repeatMode('queue');
		case 'song':
			return this.musicUtils.repeatMode('song');
		case 'off':
			return this.musicUtils.repeatMode('off');
		default:
			break;
		}
	}

	@Slash({
		description: 'Skips the currently playing song.',
		name: 'skip',
	})
	async skip(interaction: ChatInputCommandInteraction) {
		if (this.musicUtils.check(['voiceCheck', 'checkPlaying'])) return;

		this.player.stop();

		return interaction.reply({
			embeds: [this.embed.setDescription('🔹 | Skipped.')],
		});
	}

	@Slash({
		description: 'Pauses the currently playing song.',
		name: 'pause',
	})
	async pause(interaction: ChatInputCommandInteraction) {
		if (this.musicUtils.check(['voiceCheck', 'checkPlaying'])) return;

		this.player.pause(true);

		return interaction.reply({
			embeds: [this.embed.setDescription('🔹 | Paused.')],
		});
	}

	@Slash({
		description: 'Resumes the currently playing song.',
		name: 'resume',
	})
	async resume(interaction: ChatInputCommandInteraction) {
		if (this.musicUtils.check(['voiceCheck'])) return;

		this.player.pause(false);

		return interaction.reply({
			embeds: [this.embed.setDescription('🔹 | Resumed.')],
		});
	}

	@Slash({
		description: 'Stops the currently playing songs and disconnects the bot.',
		name: 'stop',
	})
	async stop(interaction: ChatInputCommandInteraction) {
		if (this.musicUtils.check(['voiceCheck'])) return;

		this.player.destroy();

		return interaction.reply({
			embeds: [this.embed.setDescription('🔹 | Disconnected.')],
		});
	}

	@Slash({
		description: 'Shows you the lyrics of the currently playing song.',
		name: 'lyrics',
	})
	async lyrics(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const gClient = new Client(client.config.APIs.geniusKey);
		await interaction.deferReply();

		if (this.musicUtils.check(['voiceCheck', 'checkPlaying'])) return;

		const track = this.player.queue.current;
		const trackTitle = track.title.replace(
			/(lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|\[.+\])/gi,
			'',
		);
		const actualTrack = await gClient.songs.search(trackTitle);
		const searches = actualTrack[0];
		const lyrics = await searches.lyrics();

		return interaction.editReply({
			embeds: [
				this.embed
					.setAuthor({
						name: `🔹 | Lyrics for ${trackTitle}`,
						url: searches.url,
					})
					.setDescription(lyrics)
					.setFooter({ text: 'Lyrics are powered by Genius.' }),
			],
		});
	}

	@Slash({
		description: 'Shuffles the queue.',
		name: 'shuffle',
	})
	async shuffle(interaction: ChatInputCommandInteraction) {
		if (this.musicUtils.check(['voiceCheck', 'checkQueue'])) return;

		this.player.queue.shuffle();

		return interaction.editReply({
			embeds: [this.embed.setDescription('🔹 | Shuffled.')],
		});
	}

	@Slash({
		description: 'Shows you the currently playing song.',
		name: 'nowplaying',
	})
	async nowplaying(interaction: ChatInputCommandInteraction) {
		if (this.musicUtils.check(['voiceCheck', 'checkPlaying'])) return;
		const track = this.player.queue.current;

		return interaction.reply({
			embeds: [
				this.embed
					.setAuthor({
						name: 'Now Playing',
						iconURL: interaction.user.avatarURL(),
					})
					.setDescription(
						`**[${track.title}](${track.uri})** [${track.requester}]`,
					),
			],
		});
	}

	@Slash({
		description: 'Shows you the queue.',
		name: 'queue',
	})
	async queue(interaction: ChatInputCommandInteraction) {
		this.util = new Util(interaction);
		const { guild } = interaction;
		await interaction.deferReply();

		if (this.musicUtils.check(['voiceCheck', 'checkPlaying', 'checkQueue']))
			return;

		const embeds = [];
		const songs = [];

		for (let i = 0; i < this.player.queue.length; i++) {
			songs.push(
				`${i + 1}. [${this.player.queue[i].title}](${
					this.player.queue[i].uri
				}) [${this.player.queue[i].requester}]`,
			);
		}

		for (let i = 0; i < songs.length; i += 10) {
			const embed = new EmbedBuilder().setColor('Blurple');

			embed
				.setAuthor({ name: `Current queue for ${guild.name}` })
				.setTitle(`▶️ | Currently playing: ${this.player.queue.current.title}`)
				.setDescription(songs.slice(i, i + 10).join('\n'))
				.setTimestamp();
			embeds.push(embed);
		}

		return this.util.embedPages(embeds);
	}

	@Slash({
		description: 'Applies a filter.',
		name: 'filters',
	})
	async filters(
		@SlashChoice({ name: '🔹 | 3D', value: '3d' })
		@SlashChoice({ name: '🔹 | Bass Boost', value: 'bassboost' })
		@SlashChoice({ name: '🔹 | Karaoke', value: 'karaoke' })
		@SlashChoice({ name: '🔹 | Nightcore', value: 'nightcore' })
		@SlashChoice({ name: '🔹 | Slow Motion', value: 'slowmo' })
		@SlashChoice({ name: '🔹 | Soft', value: 'soft' })
		@SlashChoice({ name: '🔹 | TV', value: 'tv' })
		@SlashChoice({ name: '🔹 | Treble Bass', value: 'treblebass' })
		@SlashChoice({ name: '🔹 | Vaporwave', value: 'vaporwave' })
		@SlashChoice({ name: '🔹 | Vibrato', value: 'vibrato' })
		@SlashChoice({ name: '🔹 | Reset', value: 'reset' })
		@SlashOption({
			name: 'option',
			description: 'Select the filter you would like to be applied.',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
			option: string,
	) {
		if (this.musicUtils.check(['voiceCheck', 'checkPlaying'])) return;

		switch (option) {
		case '3d':
			return this.musicUtils.filters('3d');
		case 'bassboost':
			return this.musicUtils.filters('bassboost');
		case 'karaoke':
			return this.musicUtils.filters('karaoke');
		case 'nightcore':
			return this.musicUtils.filters('nightcore');
		case 'slowmo':
			return this.musicUtils.filters('slowmo');
		case 'soft':
			return this.musicUtils.filters('soft');
		case 'tv':
			return this.musicUtils.filters('tv');
		case 'treblebass':
			return this.musicUtils.filters('treblebass');
		case 'vaporwave':
			return this.musicUtils.filters('vaporwave');
		case 'vibrato':
			return this.musicUtils.filters('vibrato');
		case 'reset':
			return this.musicUtils.filters('reset');
		default:
			break;
		}
	}

	/**
	 * The components below handle the logic
	 * for the buttons when the 'trackStart' event gets emitted.
	 */
	@ButtonComponent({
		id: 'pause',
	})
	async pauseButton(interaction: ButtonInteraction): Promise<void> {
		const { user } = interaction;

		if (this.musicUtils.check(['voiceCheck'])) return;

		if (this.player.isPaused) {
			this.player.pause(false);

			interaction.editReply({
				embeds: [
					this.embed.setDescription('🔹 | Resumed.').setFooter({
						text: `Action executed by ${user.username}.`,
						iconURL: user.avatarURL(),
					}),
				],
			});

			return;
		}
		else {
			this.player.pause(true);

			interaction.editReply({
				embeds: [
					this.embed.setDescription('🔹 | Paused.').setFooter({
						text: `Action executed by ${user.username}.`,
						iconURL: user.avatarURL(),
					}),
				],
			});

			return;
		}
	}

	@ButtonComponent({
		id: 'shuffle',
	})
	async shuffleButton(interaction: ButtonInteraction): Promise<void> {
		const { user } = interaction;

		if (this.musicUtils.check(['voiceCheck'])) return;

		this.player.queue.shuffle();

		interaction.reply({
			embeds: [
				this.embed.setDescription('🔹 | Shuffled the queue.').setFooter({
					text: `Action executed by ${user.username}.`,
					iconURL: user.avatarURL(),
				}),
			],
		});

		return;
	}

	@ButtonComponent({
		id: 'skip',
	})
	async skipButton(interaction: ButtonInteraction): Promise<void> {
		const { user } = interaction;

		if (this.musicUtils.check(['voiceCheck', 'checkQueue'])) return;

		this.player.stop();

		interaction.editReply({
			embeds: [
				this.embed.setDescription('🔹 | Skipped.').setFooter({
					text: `Action executed by ${user.username}.`,
					iconURL: user.avatarURL(),
				}),
			],
		});

		return;
	}

	@ButtonComponent({
		id: 'voldown',
	})
	async volDownButton(): Promise<void> {
		const volume = this.player.volume - 10;
		if (this.musicUtils.check(['voiceCheck'])) return;

		this.musicUtils.setVolume(volume);

		return;
	}

	@ButtonComponent({
		id: 'volup',
	})
	async volUpButton(): Promise<void> {
		const volume = this.player.volume + 10;
		if (this.musicUtils.check(['voiceCheck'])) return;

		this.musicUtils.setVolume(volume);

		return;
	}
}
