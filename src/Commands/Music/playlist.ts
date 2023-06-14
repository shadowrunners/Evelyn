import {
	EmbedBuilder,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} from 'discord.js';
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';
import { Playlists as DB } from '../../Schemas/playlist.js';
import { Util } from '../../Utils/Utils/Util.js';
import { Evelyn } from '../../Evelyn.js';

@Discord()
@SlashGroup({
	description: 'A complete playlist system.',
	name: 'playlist',
})
@SlashGroup('playlist')
export class Playlist {
	private embed: EmbedBuilder;

	constructor() {
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
	}

	@Slash({
		description: 'Create a new playlist.',
		name: 'create',
	})
	async create(
		@SlashOption({
			name: 'name',
			description: 'Provide a name for the playlist.',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
			name: string,
			interaction: ChatInputCommandInteraction,
	) {
		const userData = await DB.find({
			userID: interaction.user.id,
		});

		if (name.length > 12)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The name of the playlist cannot be more than 12 characters.',
					),
				],
			});

		if (userData?.length >= 10)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | You can only create 10 playlists at a time.',
					),
				],
			});

		await DB.create({
			name: interaction.user.username,
			userID: interaction.user.id,
			playlistName: name,
			created: Math.round(Date.now() / 1000),
		});

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | Your playlist **${name}** has been created.`,
				),
			],
		});
	}

	@Slash({
		description: 'Deletes the provided playlist.',
		name: 'delete',
	})
	async delete(
		@SlashOption({
			name: 'name',
			description: 'Provide a name for the playlist.',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
			name: string,
			interaction: ChatInputCommandInteraction,
	) {
		const playlistData = await DB.findOne({
			userID: interaction.user.id,
			playlistName: name,
		});

		if (!playlistData)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | There is no playlist with that name or no data regarding that user.',
					),
				],
				ephemeral: true,
			});

		await playlistData.deleteOne();

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | Your playlist **${name}** has been deleted.`,
				),
			],
		});
	}

	@Slash({
		description: 'Adds the currently playing song to the playlist.',
		name: 'addcurrent',
	})
	async addcurrent(
		@SlashOption({
			name: 'name',
			description: 'Provide the name of the playlist.',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
			name: string,
			interaction: ChatInputCommandInteraction,
			client: Evelyn,
	) {
		const player = client.manager.players.get(interaction.guildId);
		const track = player.queue.current;

		if (!track)
			return interaction.reply({
				embeds: [this.embed.setDescription('🔹 | Nothing is playing.')],
				ephemeral: true,
			});

		await DB.updateOne(
			{
				userID: interaction.user.id,
				playlistName: name,
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

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | **[${track.title}](${track.uri})** has been added to your playlist.`,
				),
			],
		});
	}

	@Slash({
		description: 'Lists the tracks of the provided playlist.',
		name: 'info',
	})
	async info(
		@SlashOption({
			name: 'name',
			description: 'Provide the name of the playlist.',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
			name: string,
			interaction: ChatInputCommandInteraction,
	) {
		const util = new Util();

		const pData = await DB.findOne({
			playlistName: name,
			userID: interaction.user.id,
		});

		if (!pData)
			return interaction.reply({
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
				})** • [${util.formatTime(trackData[i].duration)}]`,
			);
		}

		for (let i = 0; i < tracks.length; i += 10) {
			this.embed
				.setTitle(`${pData.playlistName} by ${pData.createdBy}`)
				.setDescription(tracks.slice(i, i + 10).join('\n'));
			embeds.push(this.embed);
		}

		return util.embedPages(embeds);
	}

	@Slash({
		description: 'Lists all your playlists.',
		name: 'list',
	})
	async list(interaction: ChatInputCommandInteraction) {
		const util = new Util();
		const pData = await DB.find({ userID: interaction.user.id });

		if (!pData)
			return interaction.reply({
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

		return util.embedPages(embeds);
	}

	@Slash({
		description: 'Removes the provided song from your playlist.',
		name: 'removesong',
	})
	async removesong(
		@SlashOption({
			name: 'name',
			description: 'Provide the name of the playlist.',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		@SlashOption({
			name: 'songid',
			description: 'Provide the number of the song.',
			required: true,
			type: ApplicationCommandOptionType.Number,
		})
			name: string,
			songid: number,
			interaction: ChatInputCommandInteraction,
	) {
		const pData = await DB.findOne({
			playlistName: name,
			userID: interaction.user.id,
		});

		if (!pData?.playlistData)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | There is no playlist with that name or no data regarding that user.',
					),
				],
				ephemeral: true,
			});

		if (songid >= pData?.playlistData.length || songid < 0)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | Track ID is out of range, see your playlist via /playlist list (playlistName)',
					),
				],
				ephemeral: true,
			});

		await DB.updateOne(
			{
				userID: interaction.user.id,
				playlistName: name,
			},
			{
				$pull: {
					playlistData: pData.playlistData[songid],
				},
			},
		);

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔹 | **${pData.playlistData[songid].title}** has been removed from your playlist.`,
				),
			],
		});
	}
}
