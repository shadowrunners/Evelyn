import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'tickets.manage-panel',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');
		const data = await DB.findOne({ id: guildId });
		const { tickets } = data;

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'tickets.embed.color': options.getString('color'),
					'tickets.embed.title': options.getString('title'),
					'tickets.embed.description': options.getString('description'),
					'tickets.embed.author.name': options.getString('author-name'),
					'tickets.embed.author.icon_url': options.getString('author-icon'),
					'tickets.embed.footer.text': options.getString('footer-text'),
					'tickets.embed.footer.icon_url': options.getString('footer-icon'),
					'tickets.embed.image.url': options.getString('image'),
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed
					.setTitle('Ticket Embed Updated')
					.setDescription(
						'The following embed data has been successfully saved. Some values may return a null value. This is not a bug, it just means you didn\'t provide a value for it.',
					)
					.addFields(
						{
							name: '🔹 | Color',
							value: `> ${tickets.embed.color}`,
						},
						{
							name: '🔹 | Title',
							value: `> ${tickets.embed.title}`,
						},
						{
							name: '🔹 | Description',
							value: `> ${tickets.embed.description}`,
						},
						{
							name: '🔹 | Author Name',
							value: `> ${tickets.embed.author.name}`,
						},
						{
							name: '🔹 | Author Icon',
							value: `> ${tickets.embed.author.icon_url}`,
						},
						{
							name: '🔹 | Footer Text',
							value: `> ${tickets.embed.footer.text}`,
						},
						{
							name: '🔹 | Footer Icon',
							value: `> ${tickets.embed.footer.icon_url}`,
						},
						{
							name: '🔹 | Image',
							value: `> ${tickets.embed.image.url}`,
						},
					),
			],
			ephemeral: true,
		});
	},
};

export default subCommand;
