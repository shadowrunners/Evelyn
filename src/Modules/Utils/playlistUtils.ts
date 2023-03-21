/**
 * This class contains Evelyn's custom playlist system to give users a way to save their favorite songs.
 */
import { Playlists as DB } from '../../Structures/Schemas/playlist.js';
import { Util } from './utils.js';
import { EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Player } from '@shadowrunners/automata';

export class PlaylistUtils {
	private interaction: ChatInputCommandInteraction;
	private embed: EmbedBuilder;
	private util: Util;

	/** Creates a new instance of the Playlist Engine class. */
	constructor(interaction: ChatInputCommandInteraction) {
		this.interaction = interaction;
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		this.util = new Util(this.interaction);
	}

	/** Adds the current track to your playlist. */
	public async addCurrentTrack(player: Player, pName: string) {
		const { user } = this.interaction;
		const track = player.currentTrack.info;

		if (!track) {
			return this.interaction.reply({
				embeds: [this.embed.setDescription('🔹 | Nothing is playing.')],
				ephemeral: true,
			});
		}

		await DB.updateOne(
			{
				userID: user.id,
				playlistName: pName,
			},
			{
				$push: {
					playlistData: {
						title: track.title,
						uri: track.uri,
						author: track.author,
						duration: track.length,
					},
				},
			},
		);

		return this.interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | **[${track.title}](${track.uri})** has been added to your playlist.`,
				),
			],
		});
	}

	/** Creates a new playlist. */
	public async create(pName: string) {
		const { user } = this.interaction;
		const userData = await DB.find({
			userID: user.id,
		});

		if (pName.length > 12) {
			return this.interaction.editReply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The name of the playlist cannot be more than 12 characters.',
					),
				],
			});
		}

		if (userData?.length >= 10) {
			return this.interaction.editReply({
				embeds: [
					this.embed.setDescription(
						'🔹 | You can only create 10 playlists at a time.',
					),
				],
			});
		}

		await DB.create({
			name: user.username,
			userID: user.id,
			playlistName: pName,
			created: Math.round(Date.now() / 1000),
		});

		return this.interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | Your playlist **${pName}** has been created.`,
				),
			],
		});
	}

	/** Deletes a playlist. */
	public async delete(pName: string) {
		const { user } = this.interaction;
		const playlistData = await DB.findOne({
			userID: user.id,
			playlistName: pName,
		});

		if (!playlistData) {
			return this.interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | There is no playlist with that name or no data regarding that user.',
					),
				],
				ephemeral: true,
			});
		}

		await playlistData.deleteOne();

		return this.interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | Your playlist **${pName}** has been deleted.`,
				),
			],
		});
	}

	/** Shows information about a specific playlist. */
	public async info(pName: string) {
		const { user } = this.interaction;
		const { formatTime } = this.util;

		const pData = await DB.findOne({
			playlistName: pName,
			userID: user.id,
		});

		if (!pData)
			return this.interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | There is no playlist with that name or no data regarding that user.',
					),
				],
				ephemeral: true,
			});

		const trackData = pData.playlistData;
		const list = pData.playlistData.length;
		const tracks = [];
		const embeds = [];

		for (let i = 0; i < list; i++) {
			tracks.push(
				`${i + 1} • **[${trackData[i].title}](${
					trackData[i].uri
				})** • [${formatTime(trackData[i].duration)}]`,
			);
		}

		for (let i = 0; i < tracks.length; i += 10) {
			this.embed
				.setTitle(`${pData.playlistName} by ${pData.createdBy}`)
				.setDescription(tracks.slice(i, i + 10).join('\n'));
			embeds.push(this.embed);
		}

		return this.util.embedPages(embeds);
	}

	/** Shows all your playlists. */
	public async list() {
		const { user } = this.interaction;
		const pData = await DB.find({ userID: user.id });

		if (!pData)
			return this.interaction.reply({
				embeds: [this.embed.setDescription('🔹 | You have no playlists.')],
				ephemeral: true,
			});

		const playlists = [];
		const embeds = [];

		for (let i = 0; i < pData.length; i++) {
			playlists.push(
				`**${pData[i].playlistName}** • ${pData[i].playlistData?.length} song(s)`,
			);
		}

		for (let i = 0; i < playlists.length; i += 10) {
			this.embed
				.setTitle(`Playlists curated by ${pData[i].playlistName}`)
				.setDescription(playlists.slice(i, i + 10).join('\n'));
			embeds.push(this.embed);
		}

		return this.util.embedPages(embeds);
	}

	/** Removes the song provided from the specified playlist. */
	public async removeThisSong(pName: string, song: number) {
		const { user } = this.interaction;
		const pData = await DB.findOne({
			playlistName: pName,
			userID: user.id,
		});

		if (!pData?.playlistData)
			return this.interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | There is no playlist with that name or no data regarding that user.',
					),
				],
				ephemeral: true,
			});

		if (song >= pData?.playlistData.length || song < 0)
			return this.interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | Track ID is out of range, see your playlist via /playlist list (playlistName)',
					),
				],
				ephemeral: true,
			});

		await DB.updateOne(
			{
				userID: user.id,
				playlistName: pName,
			},
			{
				$pull: {
					playlistData: pData.playlistData[song],
				},
			},
		);

		return this.interaction.editReply({
			embeds: [
				this.embed.setDescription(
					`🔹 | **${pData.playlistData[song].title}** has been removed from your playlist.`,
				),
			],
		});
	}
}
