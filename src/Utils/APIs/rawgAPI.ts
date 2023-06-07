/**
 * This class contains our own custom version of a wrapper for the RAWG.io API.
 */
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { RAWGInterface } from '../../Interfaces/RAWGInterface';
import { botConfig } from '../../Interfaces/Interfaces';
import { Evelyn } from '../../Evelyn';
import superagent from 'superagent';

export class RAWGAPI {
	private apiURL: string;
	private embed: EmbedBuilder;
	private interaction: ChatInputCommandInteraction;
	private config: botConfig;

	/** Creates a new instance of the IGDB API class. */
	constructor(interaction: ChatInputCommandInteraction, client: Evelyn) {
		/** The config object. */
		this.config = client.config;
		/** The URL of the API. */
		this.apiURL = 'https://api.rawg.io/api/games';
		/** Base embed. */
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		/** The interaction object used for replying. */
		this.interaction = interaction;
	}

	/** Retrieves a game using the provided query. */
	public async fetchGame(gameName: string): Promise<RAWGInterface> {
		return new Promise((resolve, reject) => {
			// Replace % and whatever encodeURIComponent() introduces instead of small spaces to '-' for proper slugs.
			const game = encodeURIComponent(gameName.toLowerCase()).replace(
				/%[0-9A-Fa-f]{2}/g,
				'-',
			);

			superagent
				.get(`${this.apiURL}/${game}?key=${this.config.APIs.rawgKey}`)
				.then(async (res) => {
					const gameData = res.body;

					const mappedPlatforms = gameData?.platforms
						?.map(({ platform }: Platform) => platform.name)
						.join(', ');

					const mappedGenres = gameData?.genres
						?.map((genre: Genres) => genre.name)
						.join(', ');

					const mappedDevelopers = gameData?.developers
						?.map((developer: Developers) => developer.name)
						.join(', ');

					const mappedPublishers = gameData?.publishers
						?.map((publisher: Developers) => publisher.name)
						.join(', ');

					const unixDate = new Date(gameData?.released).getTime() / 1000;

					const rawgURI = `https://rawg.io/games/${game}`;

					const gameInfo: RAWGInterface = {
						name: gameData?.name,
						description: gameData?.description_raw,
						uri: rawgURI,
						developers: mappedDevelopers,
						publishers: mappedPublishers,
						platforms: mappedPlatforms,
						metacriticRating: gameData?.metacritic,
						releaseDate: unixDate,
						genres: mappedGenres,
						background_image: gameData?.background_image,
					};

					resolve(gameInfo);
				})
				.catch((err: Error) => {
					reject(err);

					return this.interaction.reply({
						embeds: [
							this.embed.setDescription(
								'🔹 | There was an error while fetching the information from the API.',
							),
						],
						ephemeral: true,
					});
				});
		});
	}
}

interface Platform {
	platform: {
		id: number;
		name: string;
		slug: string;
	};
}

interface Genres {
	id: number;
	name: string;
	slug: string;
}

interface Developers {
	id: number;
	name: string;
	slug: string;
	games_count: number;
	image_background: string;
}
