import {
	EmbedBuilder,
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
} from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { KitsuAPI } from '../../Utils/APIs/kitsuAPI.js';

@Discord()
export class Anime {
	private embed: EmbedBuilder;

	@Slash({
		description: 'Get info about an anime using Kitsu.io.',
		name: 'anime',
	})
	@Guard(
		RateLimit(TIME_UNIT.seconds, 30, {
			message: '🔹 | You are currently rate limited. Try again at {until}.',
			ephemeral: true,
		}),
	)
	async anime(
		@SlashOption({
			name: 'title',
			description: 'Provide the name of the anime.',
			type: ApplicationCommandOptionType.String,
			required: true,
		})
			title: string,
			interaction: ChatInputCommandInteraction,
	) {
		const kitsu = new KitsuAPI(interaction);
		const anime = await kitsu.fetchAnime(title);
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		return interaction.reply({
			embeds: [
				this.embed
					.setTitle(anime.titles.en_us)
					.setThumbnail(anime.posterImage.original)
					.setDescription(anime.synopsis)
					.addFields(
						{
							name: 'Genres',
							value: `> ${anime.genres}`,
						},
						{
							name: 'Premiered on',
							value: `> <t:${anime.startDateUnix}>`,
							inline: true,
						},
						{
							name: 'Ended on',
							value: `> <t:${anime.endDateUnix}>`,
							inline: true,
						},
						{
							name: 'Japanese Title',
							value: `> ${anime.titles.ja_JP}` || 'Unknown.',
							inline: true,
						},
						{
							name: 'Status',
							value: `> ${anime.status}`,
							inline: true,
						},
					),
			],
		});
	}
}
