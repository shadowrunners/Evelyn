/**
 * This class contains our own custom version of a wrapper for the Google Books API.
 */
import { get } from 'superagent';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GBooksInterface } from '../../Interfaces/GBooksInterface';

export class GBooksAPI {
	private apiURL: string;
	private embed: EmbedBuilder;
	private interaction: ChatInputCommandInteraction;

	/** Creates a new instance of the Google Books API class. */
	constructor(interaction: ChatInputCommandInteraction) {
		this.apiURL = 'https://www.googleapis.com/books/v1/volumes';
		/** Base embed. */
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		/** The interaction object used for replying. */
		this.interaction = interaction;
	}

	/** Retrieves a book using the provided query. */
	public fetchBook(book: string): Promise<GBooksInterface> {
		return new Promise((resolve, reject) => {
			get(`${this.apiURL}?q=${book}`)
				.then((res) => {
					const bookData = res.body.items[0];
					const mappedAuthors = bookData?.volumeInfo?.authors
						?.map((author: string) => author)
						.join(', ');
					const mappedCategories = bookData?.volumeInfo?.categories
						?.map((category: string) => category)
						.join(', ');

					const publishedDate = new Date(bookData?.volumeInfo?.publishedDate);
					const publishedDateUnixed = Math.floor(
						publishedDate?.getTime() / 1000,
					);

					const bookInfo: GBooksInterface = {
						title: bookData?.volumeInfo?.title,
						description: bookData?.volumeInfo?.description,
						authors: mappedAuthors,
						publisher: bookData?.volumeInfo.publisher,
						pageCount: bookData?.volumeInfo.pageCount,
						publishedDate: bookData?.publishedDate,
						publishedDateUnix: publishedDateUnixed,
						categories: mappedCategories,
						coverImage: {
							smallThumbnail: bookData?.volumeInfo?.imageLinks?.smallThumbnail,
							thumbnail: bookData?.volumeInfo?.imageLinks?.thumbnail,
						},
					};

					resolve(bookInfo);
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
