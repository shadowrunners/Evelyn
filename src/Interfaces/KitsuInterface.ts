export interface KitsuInterface {
	/** The description of the anime. Usually the same as the synopsis. */
	description: string;
	/** The synopsis of the anime. */
	synopsis: string;
	/** The titles of the anime. Can be English or Japanese. */
	titles: {
		/** The english title of the anime. */
		en_us: string;
		/** The japanese title of the anime. */
		ja_JP: string;
	};
	/** The genres the anime is under. */
	genres?: string[];
	/** The status of the anime. Can be finished, ongoing or current.*/
	status: string;
	/** The average rating of the anime. */
	averageRating: string;
	/** The date when the anime started airing. */
	startDate: string;
	/** The date when the anime started airing but in a unix format. */
	startDateUnix: number;
	/** The date when the anime ended. */
	endDate: string;
	/** The date when the anime ended.*/
	endDateUnix: number;
	/** The age rating of the anime. */
	ageRating: string;
	/** The rating guide of the anime. */
	ageRatingGuide: string;
	/** The poster image of the anime. Can be tiny, large, small, medium or original size. */
	posterImage: {
		tiny: string;
		large: string;
		small: string;
		medium: string;
		original: string;
	};
	/** The cover image of the anime. Can be tiny, large, small, medium or original size. */
	coverImage: {
		tiny: string;
		large: string;
		small: string;
		original: string;
	};
	/** The number of episodes the anime has. */
	episodeCount: number;
}
