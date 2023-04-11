import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from 'discord.js';
import { GBooksAPI } from '../../Modules/APIs/gBooksAPI';
import { Command } from '../../interfaces/interfaces';

const command: Command = {
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
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const title = options.getString('title');
		const bookAPI = new GBooksAPI(interaction);
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		const book = await bookAPI.fetchBook(title);

		return interaction.reply({
			embeds: [
				embed
					.setTitle(book.title)
					.setDescription(book.description)
					.addFields(
						{
							name: 'Categories',
							value: `> ${book.categories}`,
						},
						{
							name: 'Written by',
							value: `> ${book.authors}`,
							inline: true,
						},
						{
							name: 'Published by',
							value: `> ${book.publisher}`,
							inline: true,
						},
						{
							name: 'Pages',
							value: `> ${book.pageCount}`,
							inline: true,
						},
						{
							name: 'Released',
							value: `> <t:${book.publishedDateUnix}>`,
							inline: true,
						},
					)
					.setFooter({
						text: 'This information has been brought to you by the Google Books API.',
					})
					.setThumbnail(book.coverImage.thumbnail)
					.setTimestamp(),
			],
		});
	},
};

export default command;
