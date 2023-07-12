import {
	EmbedBuilder,
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
} from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { KitsuAPI } from '../../Utils/APIs/kitsuAPI.js';

@Discord()
export class Manga {
	private readonly embed: EmbedBuilder;

	constructor() {
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
	}

	@Slash({
		description: 'Get info about a manga using Kitsu.io.',
		name: 'manga',
	})
	@Guard(
		RateLimit(TIME_UNIT.seconds, 30, {
			message: '🔹 | Please wait 30 seconds before re-running this command.',
			ephemeral: true,
		}),
	)
	async manga(
		@SlashOption({
			name: 'title',
			description: 'Provide the name of the manga.',
			type: ApplicationCommandOptionType.String,
			required: true,
		})
			title: string,
			interaction: ChatInputCommandInteraction,
	) {
		const kitsu = new KitsuAPI(interaction);
		const manga = await kitsu.fetchManga(title);

		return interaction.reply({
			embeds: [
				this.embed
					.setTitle(manga.titles.en_us)
					.setThumbnail(manga.posterImage.original)
					.setDescription(manga.synopsis)
					.addFields(
						{
							name: 'Premiered on',
							value: `<t:${manga.startDateUnix}>`,
							inline: true,
						},
						{
							name: 'Ended on',
							value: `<t:${manga.endDateUnix}>`,
							inline: true,
						},
						{
							name: 'Japanese Title',
							value: `${manga.titles.ja_JP}`,
							inline: true,
						},
						{
							name: 'Status',
							value: manga.status,
							inline: true,
						},
					),
			],
		});
	}
}
