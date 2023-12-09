import {
	EmbedBuilder,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} from 'discord.js';
import { Discord, Slash, SlashOption, Guard } from 'discordx';
import { TMDBAPI } from '../../Services/tmdbAPI.js';
import { RateLimit, TIME_UNIT } from '@discordx/utilities';

@Discord()
export class Movie {
	private embed: EmbedBuilder;

	@Slash({
		description: 'Search for a movie using TMDB.',
		name: 'movie',
	})
	@Guard(
		RateLimit(TIME_UNIT.seconds, 30, {
			message: '🔹 | Please wait 30 seconds before re-running this command.',
			ephemeral: true,
		}),
	)
	async movie(
		@SlashOption({
			name: 'title',
			description: 'Provide the name of the movie.',
			type: ApplicationCommandOptionType.String,
			required: true,
		})
			title: string,
			interaction: ChatInputCommandInteraction,
	) {
		const API = new TMDBAPI(interaction);
		const movie = await API.fetchMovie(title);
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		return interaction.reply({
			embeds: [
				this.embed
					.setTitle(movie.title)
					.setThumbnail(movie.poster)
					.setDescription(movie.overview)
					.addFields(
						{
							name: 'Genres',
							value: `> ${movie.genres}`,
						},
						{
							name: 'Production Companies',
							value: `> ${movie.productionCompanies}`,
						},
						{
							name: 'Released on',
							value: `> <t:${movie.releaseDateUnix}>`,
							inline: true,
						},
						{
							name: 'Status',
							value: `> ${movie.status}`,
							inline: true,
						},
						{
							name: 'Rating',
							value: `> ${movie.popularity}/100`,
							inline: true,
						},
						{
							name: 'Streaming on',
							value: `> ${movie.streamingServices}`,
						},
					)
					.setFooter({
						text: 'Information provided by TMDB & JustWatch',
					}),
			],
		});
	}
}
