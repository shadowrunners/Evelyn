import {
	EmbedBuilder,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} from 'discord.js';
import { Discord, Slash, SlashOption, Guard } from 'discordx';
import { TMDBAPI } from '../../Utils/APIs/tmdbAPI.js';
import { RateLimit, TIME_UNIT } from '@discordx/utilities';

@Discord()
export class Show {
	private embed: EmbedBuilder;

	@Slash({
		description: 'Search for a show using TMDB.',
		name: 'show',
	})
	@Guard(
		RateLimit(TIME_UNIT.seconds, 30, {
			message: '🔹 | Please wait 30 seconds before re-running this command.',
			ephemeral: true,
		}),
	)
	async show(
		@SlashOption({
			name: 'title',
			description: 'Provide the name of the show.',
			type: ApplicationCommandOptionType.String,
			required: true,
		})
			title: string,
			interaction: ChatInputCommandInteraction,
	) {
		const API = new TMDBAPI(interaction);
		const show = await API.fetchTVSeries(title);
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		return interaction.reply({
			embeds: [
				this.embed
					.setTitle(show.title)
					.setThumbnail(show.poster)
					.setDescription(show.overview)
					.addFields(
						{
							name: 'Created by',
							value: `> ${show.createdBy}`,
						},
						{
							name: 'Genres',
							value: `> ${show.genres}`,
						},
						{
							name: 'Production Companies',
							value: `> ${show.productionCompanies}`,
						},
						{
							name: 'Aired between',
							value: `> <t:${show.firstAiredUnixed}> - <t:${show.lastAiredUnixed}>`,
						},
						{
							name: 'Status',
							value: `> ${show.status}`,
							inline: true,
						},
						{
							name: 'Seasons',
							value: `> ${show.seasons} season(s)`,
							inline: true,
						},
						{
							name: 'Rating',
							value: `> ${show.popularity}`,
							inline: true,
						},
						{
							name: 'Streaming on',
							value: `> ${show.streamingServices}`,
						},
					)
					.setFooter({
						text: 'Information provided by TMDB & JustWatch',
					}),
			],
		});
	}
}
