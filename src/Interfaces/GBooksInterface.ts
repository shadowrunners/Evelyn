export interface GBooksInterface {
	/** The title of the book. */
	title: string;
	/** The description of the book. */
	description: string;
	/** The authors of the book. */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	authors: any;
	/** The publisher of the book. */
	publisher: string;
	/** The number of pages that the book has. */
	pageCount: string;
	/** The date when the book was published. */
	publishedDate: string;
	/** The date when the book was published but in Unix. */
	publishedDateUnix: number;
	/** The genres the anime is under. */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	categories: any;
	/** The cover image of the book. */
	coverImage: {
		smallThumbnail: string;
		thumbnail: string;
	};
}
