import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interfaces/interfaces';
import { KitsuAPI } from '../../Modules/APIs/kitsuAPI';

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('anime')
		.setDescription('Get info about an anime using Kitsu.io.')
		.addStringOption((option) =>
			option
				.setName('title')
				.setDescription('Provide the name of the anime')
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const title = options.getString('title');
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const { fetchAnime } = new KitsuAPI(interaction);

		const anime = await fetchAnime(title);
		return interaction.reply({
			embeds: [
				embed
					.setTitle(anime.titles.en_us)
					.setThumbnail(anime.posterImage.original)
					.setDescription(anime.synopsis)
					.addFields(
						{
							name: 'Premiered on',
							value: anime.startDate,
							inline: true,
						},
						{
							name: 'Japanese Title',
							value: `${anime.titles.ja_JP}` || 'Unknown.',
							inline: true,
						},
						{
							name: 'Status',
							value: anime.status,
							inline: true,
						},
					),
			],
		});
	},
};

export default command;
