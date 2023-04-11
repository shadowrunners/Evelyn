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
		/** The interaction object used for replying and fetching usernames. */
		this.interaction = interaction;
	}

	/** Retrieves the information for the provided anime. */
	fetchAnime(anime: string): Promise<KitsuInterface> {
		return new Promise((resolve, reject) => {
			get(`${this.apiURL}/anime?filter[text]=${anime}`)
				.then((res) => {
					const animeData = res.body.data[0];
					const animeAttributes = animeData.attributes;
					const newStatus = animeAttributes?.status
						.replace('finished', 'Finished')
						.replace('ongoing', 'Ongoing')
						.replace('current', 'Currently Airing');

					const animeInfo: KitsuInterface = {
						description: animeAttributes?.description,
						synopsis: animeAttributes?.synopsis,
						titles: {
							en_us:
								animeAttributes?.titles?.en_jp ??
								animeAttributes?.titles?.en_us,
							ja_JP: animeAttributes?.titles?.ja_jp,
						},
						status: newStatus,
						averageRating: animeAttributes?.averageRating,
						startDate: animeAttributes?.startDate,
						endDate: animeAttributes?.endDate,
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

					return this.interaction.editReply({
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
