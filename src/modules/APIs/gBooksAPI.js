/** This class contains our own custom version of a wrapper for the Google Books API.*/
const { get } = require('superagent');
const { EmbedBuilder } = require('discord.js');

module.exports = class GBooksAPI {
	/** Creates a new instance of the Google Books API class. */
	constructor() {
		this.apiURL = 'https://www.googleapis.com/books/v1/volumes';
		/** Base embed. */
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
	}

	/** Retrieves a book using the provided query.
	 * @param {String} book - The provided book title.
	 */
	fetchBook(book) {
		return new Promise((resolve, reject) => {
			get(`${this.apiURL}?q=${book}`)
				.then((res) => {
					resolve(res.body.items);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
};
