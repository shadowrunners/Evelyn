/**
 * A wrapper for the Google Books API.
 */

import { GBooksInterface } from '@/Interfaces/interfaces.js';
import { singleton } from 'tsyringe';
import superagent from 'superagent';

@singleton()
export class GoogleBooks {
	/** The URL of the API. */
	private readonly apiURL: string = 'https://www.googleapis.com/books/v1/volumes';

	/** Retrieves a book using the provided query. */
	public async fetchBook(book: string): Promise<GBooksInterface> {
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
}
