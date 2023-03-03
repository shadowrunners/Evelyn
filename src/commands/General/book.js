const {
	SlashCommandBuilder,
	// eslint-disable-next-line no-unused-vars
	ChatInputCommandInteraction,
	EmbedBuilder,
} = require('discord.js');
const GBooksAPI = require('../../modules/APIs/gBooksAPI.js');

module.exports = {
	botPermissions: ['SendMessages'],
	data: new SlashCommandBuilder()
		.setName('book')
		.setDescription('Get info about a book using Google Books.')
		.addStringOption((option) =>
			option
				.setName('title')
				.setDescription('Provide the name of the book.')
				.setRequired(true),
		),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const bookAPI = new GBooksAPI();
		const { options } = interaction;
		const title = options.getString('title');
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		try {
			const fetchedBook = await bookAPI.fetchBook(title);
			const book = fetchedBook[0].volumeInfo;
			const date = new Date(book.publishedDate).getTime() / 1000;

			return interaction.reply({
				embeds: [
					embed
						.setTitle(book.title)
						.setDescription(book.description)
						.addFields(
							{
								name: 'Released',
								value: `> <t:${date}:R>`,
								inline: true,
							},
							{
								name: 'Categories',
								value: `> ${book.categories}`,
							},
							{
								name: 'Authors',
								value: `> ${book.authors}`,
								inline: true,
							},
							{
								name: 'Published by',
								value: `> ${book.publisher}`,
								inline: true,
							},
						)
						.setFooter({
							text: 'This information has been brought to you by the Google Books API',
						})
						.setThumbnail(book.imageLinks.thumbnail)
						.setTimestamp(),
				],
			});
		}
		catch (_err) {
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | An error has occured when retrieving information for the book you provided. A log has been sent to the developer for review.',
					),
				],
				ephemeral: true,
			});
		}
	},
};
