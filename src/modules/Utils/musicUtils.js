/**
 * This is the file for the Music Utilities.
 * The main purpose of this file is having some common functions to avoid repeated code.
 */

/* eslint-disable no-unused-vars */
const { EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const { Player } = require('@shadowrunners/automata');
const pms = require('pretty-ms');

module.exports = class MusicUtils {
	/** Creates a new instance of the Music Utils Engine class.
	 * @param {ChatInputCommandInteraction} interaction - Represents the Interaction object from Discord.js.
	 * @param {Player} player - Represents the player instance.
	 */
	constructor(interaction, player) {
		this.interaction = interaction;
		this.embed = new EmbedBuilder().setColor('Blurple');
		this.player = player;

		/** Returns if the player isn't defined. */
		if (this.player) return;
	}

	/** Handles all checks regarding voice, queues and currently playing songs. */
	check(checkTypes) {
		const yourVC = this.interaction.member.voice.channel;
		const herVC = this.interaction.guild.members.me.voice.channelId;

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

	/** Handles a check regarding the queue. */
	checkQueue() {
		if (this.player?.queue.size === 0)
			return this.interaction.editReply({
				embeds: [
					this.embed.setDescription('🔹 | There is nothing in the queue.'),
				],
			});
	}

	/** Handles a check regarding the player and if it's playing anything. */
	checkPlaying() {
		if (!this.player?.isPlaying)
			return this.interaction.editReply({
				embeds: [this.embed.setDescription('🔹 | I\'m not playing anything.')],
			});
	}

	/** This function switches the repeat modes. */
	repeatMode(mode) {
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
	seek(time) {
		const duration = Number(time) * 1000;
		const trackDuration = this.player.currentTrack.info.length;

		if (duration > trackDuration)
			return this.interaction.editReply({
				embeds: [this.embed.setDescription('🔹 | Invalid seek time.')],
			});

		this.player.seekTo(duration);

		return this.interaction.editReply({
			embeds: [this.embed.setDescription(`🔹 | Seeked to ${pms(duration)}.`)],
		});
	}

	/** Sets the volume for the player. */
	setVolume(volume) {
		if (volume > 100 || volume < 0)
			return this.interaction.editReply({
				embeds: [
					this.embed.setDescription(
						'🔹| You can only set the volume from 0 to 100.',
					),
				],
				ephemeral: true,
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
						iconURL: this.interaction.user.avatarURL({ dynamic: true }),
					}),
			],
		});
	}

	/** Easily manage filters. */
	filters(mode) {
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
			this.player.filters.karaoke();

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
			this.player.filters.vibrato();

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

	/**
	 * Checks the query to see if it contains YouTube or YouTube Music.
	 * @param {String} query - The query object provided by the user.
	 */
	checkQuery(query) {
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
};
