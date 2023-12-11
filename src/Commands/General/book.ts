import { EmbedBuilder, ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { inject, injectable } from 'tsyringe';
import { GoogleBooks } from '@Services';

@Discord()
@injectable()
export class Book {
	private embed: EmbedBuilder;

	// eslint-disable-next-line no-empty-function
	constructor(@inject(GoogleBooks) private readonly gBooks: GoogleBooks) {}

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
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		await this.gBooks.fetchBook(title)
			.then((book) => {
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
								text: 'This information has been brought to you by Google Books',
							})
							.setTimestamp()
							.setThumbnail(book.coverImage.thumbnail),
					],
				});
			}).catch(() => {
				return interaction.reply({
					embeds: [this.embed.setDescription('🔹 | No results found.')],
					ephemeral: true,
				});
			});
	}
}
