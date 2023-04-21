import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interfaces/interfaces';
import { KitsuAPI } from '../../Modules/APIs/kitsuAPI';

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('manga')
		.setDescription('Get info about a manga using Kitsu.io.')
		.addStringOption((option) =>
			option
				.setName('title')
				.setDescription('Provide the name of the manga.')
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction;
		const title = options.getString('title');
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const kitsu = new KitsuAPI(interaction);

		const manga = await kitsu.fetchManga(title);
		return interaction.reply({
			embeds: [
				embed
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
							value: `${manga.titles.ja_JP}` || 'Unknown.',
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
	},
};

export default command;
