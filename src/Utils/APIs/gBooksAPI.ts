/**
 * This class contains our own custom version of a wrapper for the Google Books API.
 */
import superagent from 'superagent';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GBooksInterface } from '../../Interfaces/Interfaces.js';

export class GBooksAPI {
	private readonly apiURL: string;
	private readonly embed: EmbedBuilder;
	private readonly interaction: ChatInputCommandInteraction;

	/** Creates a new instance of the Google Books API class. */
	constructor(interaction: ChatInputCommandInteraction) {
		this.apiURL = 'https://www.googleapis.com/books/v1/volumes';
		/** Base embed. */
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		/** The interaction object used for replying. */
		this.interaction = interaction;
	}

	/** Retrieves a book using the provided query. */
	public async fetchBook(book: string): Promise<GBooksInterface> {
		try {
			const res = await superagent.get(`${this.apiURL}?q=${book}`);
			const bookData = res.body.items?.[0]?.volumeInfo;

			const mappedAuthors = bookData?.authors?.join(', ');
			const mappedCategories = bookData?.categories?.join(', ');

			const publishedDate = new Date(bookData?.publishedDate);
			const publishedDateUnix = Math.floor(publishedDate?.getTime() / 1000);

			const bookInfo: GBooksInterface = {
				title: bookData?.title,
				description: bookData?.description,
				authors: mappedAuthors,
				publisher: bookData?.publisher,
				pageCount: bookData?.pageCount,
				publishedDate: bookData?.publishedDate,
				publishedDateUnix,
				categories: mappedCategories,
				coverImage: {
					smallThumbnail: bookData?.imageLinks?.smallThumbnail,
					thumbnail: bookData?.imageLinks?.thumbnail,
				},
			};

			return bookInfo;
		}
		catch (err) {
			this.interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | There was an error while fetching the information from the API.',
					),
				],
				ephemeral: true,
			});

			throw err;
		}
	}
}
