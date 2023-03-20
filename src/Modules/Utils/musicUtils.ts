/**
 * This is the file for the Music Utilities.
 * The main purpose of this file is having some common functions to avoid repeated code.
 */

import {
	EmbedBuilder,
	ChatInputCommandInteraction,
	VoiceChannel,
	GuildMember,
} from 'discord.js';
import { Player } from '@shadowrunners/automata';
import { Util } from './utils.js';

export class MusicUtils {
	private interaction: ChatInputCommandInteraction;
	private embed: EmbedBuilder;
	private player: Player;
	private util: Util;

	/** Creates a new instance of the Music Utils Engine class. */
	constructor(interaction: ChatInputCommandInteraction, player: Player) {
		this.interaction = interaction;
		this.embed = new EmbedBuilder().setColor('Blurple');
		this.player = player;
		this.util = new Util();

		/** Returns if the player isn't defined. */
		if (this.player) return;
	}

	/** Handles all checks regarding voice, queues and currently playing songs. */
	public check(checkTypes: string[]) {
		const { member, guild } = this.interaction;
		const serverMember = member as GuildMember;
		const yourVC = serverMember.voice.channel as VoiceChannel;
		const herVC = guild.members.me.voice.channelId;

		for (const checkType of checkTypes) {
			switch (checkType) {
			case 'voiceCheck':
				if (!yourVC)
					return this.interaction.editReply({
						embeds: [
							this.embed.setDescription(
								'🔹 | You need to be in a voice channel to use this command.',
							),
						],
					});

				if (herVC && yourVC.id !== herVC)
					return this.interaction.editReply({
						embeds: [
							this.embed.setDescription(
								`🔹 | Sorry but I'm already playing music in <#${herVC}>.`,
							),
						],
					});

				break;

			case 'checkQueue':
				if (this.player?.queue.size === 0)
					return this.interaction.editReply({
						embeds: [
							this.embed.setDescription(
								'🔹 | There is nothing in the queue.',
							),
						],
					});

				break;

			case 'checkPlaying':
				if (!this.player?.isPlaying)
					return this.interaction.editReply({
						embeds: [
							this.embed.setDescription('🔹 | I\'m not playing anything.'),
						],
					});

				break;

			default:
				break;
			}
		}
	}

	/** This function switches the repeat modes. */
	public repeatMode(mode: string) {
		switch (mode) {
		case 'queue':
			this.player.setLoop('QUEUE');

			return this.interaction.editReply({
				embeds: [
					this.embed.setDescription('🔹 | Repeat mode is now on. (Queue)'),
				],
			});
		case 'song':
			this.player.setLoop('TRACK');

			return this.interaction.editReply({
				embeds: [
					this.embed.setDescription('🔹 | Repeat mode is now on. (Song)'),
				],
			});
		case 'none':
			this.player.setLoop('NONE');

			return this.interaction.editReply({
				embeds: [this.embed.setDescription('🔹 | Repeat mode is now off.')],
			});
		default:
			break;
		}
	}

	/** This function seeks to the time provided by you. */
	public seek(time: number) {
		const duration = Number(time) * 1000;
		const trackDuration = this.player.currentTrack.info.length;

		if (duration > trackDuration)
			return this.interaction.editReply({
				embeds: [this.embed.setDescription('🔹 | Invalid seek time.')],
			});

		this.player.seekTo(duration);

		return this.interaction.editReply({
			embeds: [
				this.embed.setDescription(
					`🔹 | Seeked to ${this.util.formatTime(duration)}.`,
				),
			],
		});
	}

	/** Sets the volume for the player. */
	public setVolume(volume: number) {
		if (volume > 100 || volume < 0)
			return this.interaction.editReply({
				embeds: [
					this.embed.setDescription(
						'🔹| You can only set the volume from 0 to 100.',
					),
				],
			});

		this.player.setVolume(volume);

		return this.interaction.editReply({
			embeds: [
				this.embed
					.setDescription(
						`🔹 | Volume has been set to **${this.player.volume}%**.`,
					)
					.setFooter({
						text: `Action executed by ${this.interaction.user.username}.`,
						iconURL: this.interaction.user.avatarURL(),
					}),
			],
		});
	}

	/** Easily manage filters. */
	public filters(mode: string) {
		const embed = new EmbedBuilder()
			.setTitle('🎧 Filter applied!')
			.setDescription(
				'The filter you requested will be applied. It may take a few seconds for it to propagate.',
			);

		switch (mode) {
		case '3d':
			this.player.node.rest.updatePlayer({
				guildId: this.interaction.guildId,
				data: {
					filters: {
						rotation: { rotationHz: 0.2 },
					},
				},
			});

			return this.interaction.editReply({
				embeds: [embed],
			});
		case 'bassboost':
			this.player.filters.bassBoost();

			return this.interaction.editReply({
				embeds: [embed],
			});
		case 'karaoke':
			// this.player.filters.karaoke();

			return this.interaction.editReply({
				embeds: [embed],
			});
		case 'nightcore':
			this.player.filters.nightcore();

			return this.interaction.editReply({
				embeds: [embed],
			});
		case 'slowmo':
			this.player.filters.slowmo();

			return this.interaction.editReply({
				embeds: [embed],
			});
		case 'soft':
			this.player.filters.soft();

			return this.interaction.editReply({
				embeds: [embed],
			});
		case 'tv':
			this.player.filters.tv();

			return this.interaction.editReply({
				embeds: [embed],
			});
		case 'treblebass':
			this.player.filters.trebleBass();

			return this.interaction.editReply({
				embeds: [embed],
			});
		case 'vaporwave':
			this.player.filters.vaporwave();

			return this.interaction.editReply({
				embeds: [embed],
			});
		case 'vibrato':
			// this.player.filters.vibrato();

			return this.interaction.editReply({
				embeds: [embed],
			});
		case 'reset':
			this.player.filters.clearFilters();

			return this.interaction.editReply({
				embeds: [embed],
			});
		default:
			break;
		}
	}

	/** Checks the query to see if it contains YouTube or YouTube Music. */
	public checkQuery(query: string) {
		const YTRegex = new RegExp(
			'(http(s)?://)?(www.)?(m.)?(youtube.com|youtu.be)/[a-zA-Z0-9-_]+',
		);

		const YTMRegex = new RegExp(
			'(http(s)?://)?(music.)?(m.)?(youtube.com|youtu.be)/[a-zA-Z0-9-_]+',
		);

		if (YTRegex.test(query) || YTMRegex.test(query))
			return this.interaction.editReply({
				embeds: [
					this.embed
						.setTitle('Unsupported Platform')
						.setDescription(
							'Hiya! **Support for this platform has been dropped as a result of decisions outside of our control. To alleviate this issue, you can try:**\n\n> Providing a direct link from a platform we support (SoundCloud, Spotify, Deezer, Bandcamp etc).\n> Search for it and Evelyn will try to provide the best result she finds.\n\nYou can read the full announcement in our support server linked below.',
						),
				],
			});
	}
}
