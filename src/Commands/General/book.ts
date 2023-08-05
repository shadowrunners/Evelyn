import {
	EmbedBuilder,
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
} from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { GBooksAPI } from '../../Utils/APIs/gBooksAPI.js';

@Discord()
export class Book {
	private embed: EmbedBuilder;

	@Slash({
		description: 'Get info about a book using Google Books.',
		name: 'book',
	})
	@Guard(
		RateLimit(TIME_UNIT.seconds, 30, {
			message: '🔹 | Please wait 30 seconds before re-running this command.',
			ephemeral: true,
		}),
	)
	async book(
		@SlashOption({
			name: 'title',
			description: 'Provide the name of the book.',
			type: ApplicationCommandOptionType.String,
			required: true,
		})
			title: string,
			interaction: ChatInputCommandInteraction,
	) {
		const bookAPI = new GBooksAPI(interaction);
		const book = await bookAPI.fetchBook(title);
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		return interaction.reply({
			embeds: [
				this.embed
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
					.setThumbnail(book.coverImage.thumbnail),
			],
		});
	}
}
