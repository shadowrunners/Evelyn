/**
 * This class contains our own custom version of a wrapper for the Kitsu.io to reduce the amount of packages we're using.
 * This is based on the other API wrappers for waifu.pics and NekoBot API.
 */

import { get } from 'superagent';
import { KitsuInterface } from '../../Interfaces/KitsuInterface';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export class KitsuAPI {
	private apiURL: string;
	private interaction: ChatInputCommandInteraction;
	private embed: EmbedBuilder;

	/** Creates a new instance of the KitsuAPI class. */
	constructor(interaction: ChatInputCommandInteraction) {
		this.apiURL = 'https://kitsu.io/api/edge';
		/** Base embed used to reduce repeated code. */
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		/** The interaction object used for replying. */
		this.interaction = interaction;
	}

	/** Retrieves the information for the provided anime. */
	public fetchAnime(anime: string): Promise<KitsuInterface> {
		return new Promise((resolve, reject) => {
			get(`${this.apiURL}/anime?filter[text]=${anime}`)
				.then(async (res) => {
					const animeData = res.body.data[0];
					const animeAttributes = animeData.attributes;
					const newStatus = animeAttributes?.status
						.replace('finished', 'Finished')
						.replace('ongoing', 'Ongoing')
						.replace('current', 'Currently Airing');

					const genres = await get(
						`${this.apiURL}/anime/${animeData.id}/genres`,
					);
					const genreMap = genres?.body?.data
						?.map(
							(genre: { attributes: { name: string } }) => genre.attributes.name,
						)
						.join(', ');

					const startDate = new Date(animeData?.attributes?.startDate);
					const endDate = new Date(animeData?.attributes?.endDate);

					const startDateUnixed = Math.floor(startDate?.getTime() / 1000);
					const endDateUnixed = Math.floor(endDate?.getTime() / 1000);

					const animeInfo: KitsuInterface = {
						description: animeAttributes?.description,
						synopsis: animeAttributes?.synopsis,
						titles: {
							en_us:
								animeAttributes?.titles?.en_jp ??
								animeAttributes?.titles?.en_us,
							ja_JP: animeAttributes?.titles?.ja_jp,
						},
						genres: genreMap,
						status: newStatus,
						averageRating: animeAttributes?.averageRating,
						startDate: animeAttributes?.startDate,
						startDateUnix: startDateUnixed,
						endDate: animeAttributes?.endDate,
						endDateUnix: endDateUnixed,
						ageRating: animeAttributes?.ageRating ?? 'No ratings yet.',
						ageRatingGuide: animeAttributes?.ageRatingGuide,
						posterImage: {
							tiny: animeAttributes?.posterImage?.tiny,
							large: animeAttributes?.posterImage?.large,
							small: animeAttributes?.posterImage?.small,
							medium: animeAttributes?.posterImage?.medium,
							original: animeAttributes?.posterImage?.original,
						},
						coverImage: {
							tiny: animeAttributes?.coverImage?.tiny,
							large: animeAttributes?.coverImage?.large,
							small: animeAttributes?.coverImage?.small,
							original: animeAttributes?.coverImage?.original,
						},
						episodeCount: animeAttributes?.episodeCount,
					};

					resolve(animeInfo);
				})
				.catch((err: Error) => {
					reject(err);

					return this.interaction.reply({
						embeds: [
							this.embed.setDescription(
								'🔹 | There was an error while fetching the information from the API.',
							),
						],
					});
				});
		});
	}

	/** Retrieves the information for the provided manga. */
	public fetchManga(manga: string): Promise<KitsuInterface> {
		return new Promise((resolve, reject) => {
			get(`${this.apiURL}/manga?filter[text]=${manga}`)
				.then(async (res) => {
					const mangaData = res.body.data[0];
					const mangaAttributes = mangaData.attributes;
					const newStatus = mangaAttributes?.status
						.replace('finished', 'Finished')
						.replace('ongoing', 'Ongoing')
						.replace('current', 'Currently Airing');

					const startDate = new Date(mangaData?.attributes?.startDate);
					const endDate = new Date(mangaData?.attributes?.endDate);

					const startDateUnixed = Math.floor(startDate?.getTime() / 1000);
					const endDateUnixed = Math.floor(endDate?.getTime() / 1000);

					const mangaInfo: KitsuInterface = {
						description: mangaAttributes?.description,
						synopsis: mangaAttributes?.synopsis,
						titles: {
							en_us:
								mangaAttributes?.titles?.en_jp ??
								mangaAttributes?.titles?.en_us,
							ja_JP: mangaAttributes?.titles?.ja_jp,
						},
						status: newStatus,
						averageRating: mangaAttributes?.averageRating,
						startDate: mangaAttributes?.startDate,
						startDateUnix: startDateUnixed,
						endDate: mangaAttributes?.endDate,
						endDateUnix: endDateUnixed,
						ageRating: mangaAttributes?.ageRating ?? 'No ratings yet.',
						ageRatingGuide: mangaAttributes?.ageRatingGuide,
						posterImage: {
							tiny: mangaAttributes?.posterImage?.tiny,
							large: mangaAttributes?.posterImage?.large,
							small: mangaAttributes?.posterImage?.small,
							medium: mangaAttributes?.posterImage?.medium,
							original: mangaAttributes?.posterImage?.original,
						},
						coverImage: {
							tiny: mangaAttributes?.coverImage?.tiny,
							large: mangaAttributes?.coverImage?.large,
							small: mangaAttributes?.coverImage?.small,
							original: mangaAttributes?.coverImage?.original,
						},
						episodeCount: mangaAttributes?.episodeCount,
					};

					resolve(mangaInfo);
				})
				.catch((err: Error) => {
					reject(err);

					return this.interaction.reply({
						embeds: [
							this.embed.setDescription(
								'🔹 | There was an error while fetching the information from the API.',
							),
						],
					});
				});
		});
	}
}
