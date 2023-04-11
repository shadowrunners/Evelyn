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
				.setDescription('Provide the name of the anime.')
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const title = options.getString('title');
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const kitsu = new KitsuAPI(interaction);

		const anime = await kitsu.fetchAnime(title);
		return interaction.reply({
			embeds: [
				embed
					.setTitle(anime.titles.en_us)
					.setThumbnail(anime.posterImage.original)
					.setDescription(anime.synopsis)
					.addFields(
						{
							name: 'Genres',
							value: anime.genres,
						},
						{
							name: 'Premiered on',
							value: `<t:${anime.startDateUnix}>`,
							inline: true,
						},
						{
							name: 'Ended on',
							value: `<t:${anime.endDateUnix}>`,
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
