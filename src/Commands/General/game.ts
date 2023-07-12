import {
	EmbedBuilder,
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
} from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { RAWGAPI } from '../../Utils/APIs/rawgAPI.js';
import { Evelyn } from '../../Evelyn.js';

@Discord()
export class Game {
	private embed: EmbedBuilder;

	@Slash({
		description: 'Search for a game using RAWG.',
		name: 'game',
	})
	@Guard(
		RateLimit(TIME_UNIT.seconds, 30, {
			message: '🔹 | Please wait 30 seconds before re-running this command.',
			ephemeral: true,
		}),
	)
	game(
		@SlashOption({
			name: 'title',
			description: 'Provide the name of the game.',
			type: ApplicationCommandOptionType.String,
			required: true,
		})
			title: string,
			interaction: ChatInputCommandInteraction,
			client: Evelyn,
	) {
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (!client.config.APIs.rawgKey)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | This feature cannot be used without a RAWG.io API Key. Ask your maintainer to populate the `rawgKey` field in their config.ts file to enable this feature.',
					),
				],
				ephemeral: true,
			});

		const rawgAPI = new RAWGAPI(interaction, client);

		rawgAPI
			.fetchGame(title)
			.then((result) => {
				return interaction.reply({
					embeds: [
						this.embed
							.setAuthor({ name: result.name, url: result.uri })
							.setDescription(result.description)
							.addFields(
								{
									name: 'Released',
									value: `> <t:${result.releaseDate}>`,
									inline: true,
								},
								{
									name: 'Metacritic Rating',
									value: `> ${result.metacriticRating || 'Unknown'} / 100`,
									inline: true,
								},
								{
									name: 'Developers',
									value: `> ${result.developers}`,
								},
								{
									name: 'Publishers',
									value: `> ${result.publishers}`,
								},
								{
									name: 'Genres',
									value: `> ${result.genres}`,
								},
							)
							.setThumbnail(result.background_image)
							.setFooter({
								text: 'All images and info has been provided by RAWG.io\'s API.',
							}),
					],
				});
			})
			.catch(() => {
				return interaction.reply({
					embeds: [this.embed.setDescription('🔹 | No results found.')],
					ephemeral: true,
				});
			});
	}
}
