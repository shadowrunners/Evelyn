/**
 * This class contains our own custom version of a wrapper for the Kitsu.io to reduce the amount of packages we're using.
 * This is based on the other API wrappers for waifu.pics and NekoBot API.
 */

import superagent from 'superagent';
import { KitsuInterface } from '../../Interfaces/Interfaces.js';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export class KitsuAPI {
	private readonly apiURL: string;
	private readonly interaction: ChatInputCommandInteraction;
	private readonly embed: EmbedBuilder;

	/** Creates a new instance of the KitsuAPI class. */
	constructor(interaction: ChatInputCommandInteraction) {
		this.apiURL = 'https://kitsu.io/api/edge';
		/** Base embed used to reduce repeated code. */
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		/** The interaction object used for replying. */
		this.interaction = interaction;
	}

	/** Fetches the genres of the provided anime. */
	private async fetchGenres(animeId: string) {
		const genres = await superagent.get(
			`${this.apiURL}/anime/${animeId}/genres`,
		);

		return (
			genres?.body?.data.join(', ') ??
			'No genres have been provided by the API.'
		);
	}

	/** Retrieves the information for the provided anime. */
	public async fetchAnime(anime: string): Promise<KitsuInterface> {
		try {
			const res = await superagent.get(
				`${this.apiURL}/anime?filter[text]=${anime}`,
			);

			const animeData = res.body?.data?.[0]?.attributes;
			const animeId = res.body?.data?.[0]?.id;
			const newStatus = animeData?.status
				.replace('finished', 'Finished')
				.replace('ongoing', 'Ongoing')
				.replace('current', 'Currently Airing');

			const niceGenres = await this.fetchGenres(animeId);
			const startDate = new Date(animeData?.startDate);
			const endDate = new Date(animeData?.endDate);

			const startDateUnixed = Math.floor(startDate?.getTime() / 1000);
			const endDateUnixed = Math.floor(endDate?.getTime() / 1000);

			const animeInfo: KitsuInterface = {
				description: animeData?.description,
				synopsis: animeData?.synopsis,
				titles: {
					en_us: animeData?.titles?.en_us ?? animeData?.titles?.en_jp,
					ja_JP: animeData?.titles?.ja_jp,
				},
				genres: niceGenres,
				status: newStatus,
				averageRating: animeData?.averageRating,
				startDate: animeData?.startDate,
				startDateUnix: startDateUnixed,
				endDate: animeData?.endDate,
				endDateUnix: endDateUnixed,
				ageRating: animeData?.ageRating ?? 'No ratings yet.',
				ageRatingGuide: animeData?.ageRatingGuide,
				posterImage: {
					tiny: animeData?.posterImage?.tiny,
					large: animeData?.posterImage?.large,
					small: animeData?.posterImage?.small,
					medium: animeData?.posterImage?.medium,
					original: animeData?.posterImage?.original,
				},
				coverImage: {
					tiny: animeData?.coverImage?.tiny,
					large: animeData?.coverImage?.large,
					small: animeData?.coverImage?.small,
					original: animeData?.coverImage?.original,
				},
				episodeCount: animeData?.episodeCount,
			};

			return animeInfo;
		}
		catch (err) {
			this.interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | There was an error while fetching the information from the API.',
					),
				],
			});

			throw err;
		}
	}

	/** Retrieves the information for the provided manga. */
	public async fetchManga(manga: string): Promise<KitsuInterface> {
		try {
			const res = await superagent.get(
				`${this.apiURL}/manga?filter[text]=${manga}`,
			);

			const mangaData = res.body?.data?.[0].attributes;
			const newStatus = mangaData?.status
				.replace('finished', 'Finished')
				.replace('ongoing', 'Ongoing')
				.replace('current', 'Currently Airing');

			const startDate = new Date(mangaData?.startDate);
			const endDate = new Date(mangaData?.endDate);

			const startDateUnixed = Math.floor(startDate?.getTime() / 1000);
			const endDateUnixed = Math.floor(endDate?.getTime() / 1000);

			const mangaInfo: KitsuInterface = {
				description: mangaData?.description,
				synopsis: mangaData?.synopsis,
				titles: {
					en_us: mangaData?.titles?.en_us ?? mangaData?.titles?.en_jp,
					ja_JP: mangaData?.titles?.ja_jp,
				},
				status: newStatus,
				averageRating: mangaData?.averageRating,
				startDate: mangaData?.startDate,
				startDateUnix: startDateUnixed,
				endDate: mangaData?.endDate,
				endDateUnix: endDateUnixed,
				ageRating: mangaData?.ageRating ?? 'No ratings yet.',
				ageRatingGuide: mangaData?.ageRatingGuide,
				posterImage: {
					tiny: mangaData?.posterImage?.tiny,
					large: mangaData?.posterImage?.large,
					small: mangaData?.posterImage?.small,
					medium: mangaData?.posterImage?.medium,
					original: mangaData?.posterImage?.original,
				},
				coverImage: {
					tiny: mangaData?.coverImage?.tiny,
					large: mangaData?.coverImage?.large,
					small: mangaData?.coverImage?.small,
					original: mangaData?.coverImage?.original,
				},
				episodeCount: mangaData?.episodeCount,
			};

			return mangaInfo;
		}
		catch (err) {
			this.interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | There was an error while fetching the information from the API.',
					),
				],
			});

			throw err;
		}
	}
}
