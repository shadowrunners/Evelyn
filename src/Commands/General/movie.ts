import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
} from 'discord.js';
import { Command } from '../../interfaces/interfaces';
import { Evelyn } from '../../structures/Evelyn';
import { Client } from 'imdb-api';

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('movie')
		.setDescription('Search for a movie using IMDB.')
		.addStringOption((options) =>
			options
				.setName('title')
				.setDescription('Provide the name of the movie.')
				.setRequired(true),
		),
	execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { options } = interaction;
		const title = options.getString('title');
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const { get } = new Client({ apiKey: client.config.APIs.imdbAPIKey });

		get({ name: title }, { timeout: 30000 })
			.then((result) => {
				const date = result.released;

				return interaction.reply({
					embeds: [
						embed
							.setAuthor({ name: `${result.title}` })
							.setThumbnail(result.poster)
							.setDescription(result.plot)
							.addFields([
								{
									name: 'Released',
									inline: true,
									value: `${date.toLocaleDateString('en-GB')}` || 'Unknown.',
								},
								{
									name: 'Genres',
									inline: true,
									value: `${result.genres}`.split(',').join(', '),
								},
								{
									name: 'Rating',
									inline: true,
									value: `${result.rating}/10` || 'Unknown.',
								},
								{
									name: 'Box Office',
									inline: true,
									value: `${result.boxoffice}` || 'Unknown.',
								},
								{
									name: 'Duration',
									inline: true,
									value: `${result.runtime}` || 'Unknown.',
								},
								{
									name: 'Score',
									inline: true,
									value: `${result.metascore}/100` || 'Unknown.',
								},
							]),
					],
				});
			})
			.catch(() => {
				return interaction.reply({
					embeds: [embed.setDescription('No results found.')],
				});
			});
	},
};

export default command;
