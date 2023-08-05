import type {
	ExtendedButtonInteraction,
	ExtendedChatInteraction,
} from '../../Interfaces/Interfaces.js';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import {
	Discord,
	Slash,
	SlashGroup,
	SlashOption,
	SlashChoice,
	ButtonComponent,
} from 'discordx';
import { check, checkQuery } from '../../Utils/Checks/musicChecks.js';
import { Util } from '../../Utils/Utils/Util.js';
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
	private util: Util;

	constructor() {
		this.util = new Util();
	}

	@Slash({
		name: 'play',
		description: 'Plays a song.',
	})
	async play(
		@SlashOption({
			name: 'query',
			description: 'Provide the name of the song or URL.',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
			query: string,
			interaction: ExtendedChatInteraction,
			client: Evelyn,
	) {
		const { guild, channelId, user, member } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (await check(['voiceCheck'], interaction)) return;

		const res = await client.manager.resolve({ query, requester: member.user });

		this.player = client.manager.create({
			guildId: guild.id,
			voiceChannel: member.voice.channelId,
			textChannel: channelId,
			deaf: true,
		});

		if (await checkQuery(query, interaction)) return;

		await interaction.deferReply();

		switch (res.loadType) {
		case 'playlist':
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
					embed
						.setAuthor({
							name: 'Playlist added to the queue',
							iconURL: user.avatarURL(),
						})
						.setDescription(`**[${res.playlist.name}](${query})**`)
						.addFields(
							{
								name: 'Added',
								value: `\`${res.playlist.tracks.length}\` tracks`,
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

		case 'search':
		case 'track':
			this.player.connect();
			this.player.queue.add(res.tracks[0]);

			if (!this.player.isPlaying && this.player.isConnected)
				this.player.play();

			await interaction.editReply({
				embeds: [
					embed
						.setAuthor({
							name: 'Added to the queue',
							iconURL: user.avatarURL(),
						})
						.setDescription(
							`**[${res.tracks[0].title}](${res.tracks[0].uri}) by ${res.tracks[0].author}** `,
						)
						.setThumbnail(res.tracks[0].artworkUrl)
						.addFields({
							name: 'Queued by',
							value: `${member}`,
							inline: true,
						}),
				],
			});

			if (this.player.queue.size > 1)
				embed.addFields({
					name: 'Position in queue',
					value: `${this.player.queue.size - 0}`,
					inline: true,
				});
			return interaction.editReply({ embeds: [embed] });

		case 'empty':
		case 'error':
			if (this.player) this.player?.destroy();

			return interaction.editReply({
				embeds: [embed.setDescription('🔹 | No matches found.')],
			});

		default:
			break;
		}
	}

	@Slash({
		name: 'volume',
		description: 'Alters the volume.',
	})
	async volume(
		@SlashOption({
			name: 'percent',
			description: 'Provide the name of the song or URL.',
			required: true,
			type: ApplicationCommandOptionType.Number,
		})
			percent: number,
			interaction: ExtendedChatInteraction,
	) {
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		if (await check(['voiceCheck', 'checkPlaying'], interaction, this.player))
			return;

		if (percent > 100 || percent < 0)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹| You can only set the volume from 0 to 100.',
					),
				],
				ephemeral: true,
			});

		this.player.setVolume(percent);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | Volume has been set to **${this.player.volume}%**.`,
				),
			],
		});
	}

	@Slash({
		name: 'seek',
		description: 'Skip to a specific time in the song.',
	})
	async seek(
		@SlashOption({
			name: 'time',
			description: 'Provide the timestamp.',
			required: true,
			type: ApplicationCommandOptionType.Number,
		})
			time: number,
			interaction: ExtendedChatInteraction,
	) {
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		if (await check(['voiceCheck', 'checkPlaying'], interaction, this.player))
			return;

		const duration = Number(time) * 1000;
		const trackDuration = this.player.queue.current.length;

		if (duration > trackDuration)
			return interaction.reply({
				embeds: [embed.setDescription('🔹 | Invalid seek time.')],
				ephemeral: true,
			});

		this.player.seek(duration);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | Seeked to ${this.util.formatTime(duration)}.`,
				),
			],
		});
	}

	@Slash({
		name: 'repeat',
		description: 'Repeat the current song or queue.',
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
			interaction: ExtendedChatInteraction,
	) {
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		if (await check(['voiceCheck', 'checkPlaying'], interaction, this.player))
			return;

		switch (type) {
		case 'queue':
			this.player.setLoop('QUEUE');

			return interaction.reply({
				embeds: [embed.setDescription('🔹 | Repeat mode is now on. (Queue)')],
			});
		case 'track':
			this.player.setLoop('TRACK');

			return interaction.reply({
				embeds: [embed.setDescription('🔹 | Repeat mode is now on. (Song)')],
			});
		case 'none':
			this.player.setLoop('NONE');

			return interaction.reply({
				embeds: [embed.setDescription('🔹 | Repeat mode is now off.')],
			});
		default:
			break;
		}
	}

	@Slash({
		name: 'skip',
		description: 'Skips the currently playing song.',
	})
	async skip(interaction: ExtendedChatInteraction) {
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		if (await check(['voiceCheck', 'checkPlaying'], interaction, this.player))
			return;

		this.player.stop();

		return interaction.reply({
			embeds: [embed.setDescription('🔹 | Skipped.')],
		});
	}

	@Slash({
		name: 'pause',
		description: 'Pauses the currently playing song.',
	})
	async pause(interaction: ExtendedChatInteraction) {
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		if (await check(['voiceCheck', 'checkPlaying'], interaction, this.player))
			return;

		this.player.pause(true);

		return interaction.reply({
			embeds: [embed.setDescription('🔹 | Paused.')],
		});
	}

	@Slash({
		name: 'resume',
		description: 'Resumes the currently playing song.',
	})
	async resume(interaction: ExtendedChatInteraction) {
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		if (await check(['voiceCheck'], interaction)) return;

		this.player.pause(false);

		return interaction.reply({
			embeds: [embed.setDescription('🔹 | Resumed.')],
		});
	}

	@Slash({
		name: 'stop',
		description: 'Stops the currently playing songs and disconnects the bot.',
	})
	async stop(interaction: ExtendedChatInteraction) {
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		if (await check(['voiceCheck'], interaction)) return;

		this.player.destroy();

		return interaction.reply({
			embeds: [embed.setDescription('🔹 | Disconnected.')],
		});
	}

	@Slash({
		name: 'lyrics',
		description: 'Shows you the lyrics of the currently playing song.',
	})
	async lyrics(interaction: ExtendedChatInteraction, client: Evelyn) {
		const gClient = new Client(client.config.APIs.geniusKey);
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (await check(['voiceCheck', 'checkPlaying'], interaction, this.player))
			return;

		await interaction.deferReply();

		const track = this.player.queue.current;
		const actualTrack = await gClient.songs.search(track.title);
		const searches = actualTrack[0];
		const lyrics = await searches.lyrics();

		return interaction.editReply({
			embeds: [
				embed
					.setAuthor({
						name: `🔹 | Lyrics for ${track.title}`,
						url: searches.url,
					})
					.setDescription(lyrics)
					.setFooter({ text: 'Lyrics are powered by Genius.' }),
			],
		});
	}

	@Slash({
		name: 'shuffle',
		description: 'Shuffles the queue.',
	})
	async shuffle(interaction: ExtendedChatInteraction) {
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		if (await check(['voiceCheck', 'checkQueue'], interaction, this.player))
			return;

		this.player.queue.shuffle();

		return interaction.reply({
			embeds: [embed.setDescription('🔹 | Shuffled.')],
		});
	}

	@Slash({
		name: 'nowplaying',
		description: 'Shows you the currently playing song.',
	})
	async nowplaying(interaction: ExtendedChatInteraction) {
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		if (await check(['voiceCheck', 'checkPlaying'], interaction, this.player))
			return;

		const track = this.player.queue.current;

		return interaction.reply({
			embeds: [
				embed
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
		name: 'queue',
		description: 'Shows you the queue.',
	})
	async queue(interaction: ExtendedChatInteraction) {
		this.util = new Util(interaction);
		const { guild } = interaction;

		if (
			await check(
				['voiceCheck', 'checkPlaying', 'checkQueue'],
				interaction,
				this.player,
			)
		)
			return;

		await interaction.deferReply();

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
		name: 'filters',
		description: 'Applies a filter.',
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
			interaction: ExtendedChatInteraction,
	) {
		if (await check(['voiceCheck', 'checkPlaying'], interaction, this.player))
			return;

		const embed = new EmbedBuilder()
			.setTitle('🎧 Filter applied!')
			.setDescription(
				'The filter you requested will be applied. It may take a few seconds for it to propagate.',
			);

		switch (option) {
		case '8d':
			this.player.filters.eightD();

			return interaction.reply({
				embeds: [embed],
			});
		case 'bassboost':
			this.player.filters.bassBoost();

			return interaction.reply({
				embeds: [embed],
			});
		case 'nightcore':
			this.player.filters.nightcore();

			return interaction.reply({
				embeds: [embed],
			});
		case 'slowmo':
			this.player.filters.slowmo();

			return interaction.reply({
				embeds: [embed],
			});
		case 'soft':
			this.player.filters.soft();

			return interaction.reply({
				embeds: [embed],
			});
		case 'tv':
			this.player.filters.tv();

			return interaction.reply({
				embeds: [embed],
			});
		case 'treblebass':
			this.player.filters.trebleBass();

			return interaction.reply({
				embeds: [embed],
			});
		case 'vaporwave':
			this.player.filters.vaporwave();

			return interaction.reply({
				embeds: [embed],
			});
		case 'reset':
			this.player.filters.clearFilters();

			return interaction.reply({
				embeds: [embed],
			});
		default:
			break;
		}
	}

	@Slash({
		name: 'join',
		description: 'Pairs the bot to your channel.',
	})
	async join(interaction: ExtendedChatInteraction, client: Evelyn) {
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const { guild, channelId, member } = interaction;

		if (await check(['voiceCheck'], interaction)) return;

		if (!this.player) {
			this.player = client.manager.create({
				guildId: guild.id,
				voiceChannel: member.voice.channelId,
				textChannel: channelId,
				deaf: true,
			});
		}

		this.player.connect();

		return interaction.reply({
			embeds: [embed.setDescription(`🔹 | Paired to ${member.voice.channel}.`)],
		});
	}

	@Slash({
		name: 'previous',
		description: 'Plays the previous track.',
	})
	async previous(interaction: ExtendedChatInteraction) {
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (await check(['voiceCheck'], interaction)) return;

		if (!this.player?.queue?.previous)
			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | Couldn\'t find the previous track.'),
				],
				ephemeral: true,
			});

		if (this.player.queue.current)
			this.player.queue.unshift(this.player.queue.previous);

		this.player.play();
		this.player.queue.previous = null;

		return interaction.reply({
			embeds: [embed.setDescription('🔹 | Playing the previous track.')],
		});
	}

	/**
	 * The components below handle the logic
	 * for the buttons when the 'trackStart' event gets emitted.
	 */
	@ButtonComponent({
		id: 'pause',
	})
	async pauseButton(interaction: ExtendedButtonInteraction) {
		const { user } = interaction;

		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		if (await check(['voiceCheck'], interaction)) return;

		if (this.player.isPaused) {
			this.player.pause(false);

			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | Resumed.').setFooter({
						text: `Action executed by ${user.username}.`,
						iconURL: user.avatarURL(),
					}),
				],
			});
		}
		else {
			this.player.pause(true);

			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | Paused.').setFooter({
						text: `Action executed by ${user.username}.`,
						iconURL: user.avatarURL(),
					}),
				],
			});
		}
	}

	@ButtonComponent({
		id: 'shuffle',
	})
	async shuffleButton(interaction: ExtendedButtonInteraction) {
		const { user } = interaction;

		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		if (await check(['voiceCheck', 'checkQueue'], interaction, this.player))
			return;

		this.player.queue.shuffle();

		return interaction.reply({
			embeds: [
				embed.setDescription('🔹 | Shuffled the queue.').setFooter({
					text: `Action executed by ${user.username}.`,
					iconURL: user.avatarURL(),
				}),
			],
		});
	}

	@ButtonComponent({
		id: 'skip',
	})
	async skipButton(interaction: ExtendedButtonInteraction) {
		const { user } = interaction;

		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		if (await check(['voiceCheck', 'checkQueue'], interaction, this.player))
			return;

		this.player.stop();

		return interaction.reply({
			embeds: [
				embed.setDescription('🔹 | Skipped.').setFooter({
					text: `Action executed by ${user.username}.`,
					iconURL: user.avatarURL(),
				}),
			],
		});
	}

	@ButtonComponent({
		id: 'voldown',
	})
	async volDownButton(interaction: ExtendedButtonInteraction) {
		const { user } = interaction;
		const volume = this.player.volume - 10;

		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		if (await check(['voiceCheck', 'checkPlaying'], interaction, this.player))
			return;

		if (volume < 0)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹| You can only set the volume from 0 to 100.',
					),
				],
				ephemeral: true,
			});

		this.player.setVolume(volume);

		return interaction.reply({
			embeds: [
				embed
					.setDescription(
						`🔹 | Volume has been set to **${this.player.volume}%**.`,
					)
					.setFooter({
						text: `Action executed by ${user.username}.`,
						iconURL: user.avatarURL(),
					}),
			],
		});
	}

	@ButtonComponent({
		id: 'volup',
	})
	async volUpButton(interaction: ExtendedButtonInteraction) {
		const { user } = interaction;
		const volume = this.player.volume + 10;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		if (await check(['voiceCheck', 'checkPlaying'], interaction, this.player))
			return;

		if (volume > 100)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹| You can only set the volume from 0 to 100.',
					),
				],
				ephemeral: true,
			});

		this.player.setVolume(volume);

		return interaction.reply({
			embeds: [
				embed
					.setDescription(
						`🔹 | Volume has been set to **${this.player.volume}%**.`,
					)
					.setFooter({
						text: `Action executed by ${user.username}.`,
						iconURL: user.avatarURL(),
					}),
			],
		});
	}
}
