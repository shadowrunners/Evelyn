export interface RAWGInterface {
	/** The name of the game. */
	name: string;
	/** The description of the game. */
	description: string;
	/** The URI of the game's RAWG page. */
	uri: string;
	/** The game's developer(s). */
	developers: string[];
	/** The game's publisher(s). */
	publishers: string[];
	/** The platform(s) the game is available on. */
	platforms: string[];
	/** The game's critic rating on Metacritic. */
	metacriticRating: number;
	/** The game's release date in Unix. */
	releaseDate: number;
	/** The game's genres. */
	genres: string[];
	/** The link to the game's art. */
	background_image: string;
}
