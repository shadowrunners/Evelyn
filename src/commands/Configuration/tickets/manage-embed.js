// eslint-disable-next-line no-unused-vars
const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
	subCommand: 'tickets.manage-panel',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { options, guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');
		const data = await GDB.findOne({ id: guildId });

		await GDB.findOneAndUpdate(
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
							value: `> ${data.tickets.embed.color}`,
						},
						{
							name: '🔹 | Title',
							value: `> ${data.tickets.embed.title}`,
						},
						{
							name: '🔹 | Description',
							value: `> ${data.tickets.embed.description}`,
						},
						{
							name: '🔹 | Author Name',
							value: `> ${data.tickets.embed.author.name}`,
						},
						{
							name: '🔹 | Author Icon',
							value: `> ${data.tickets.embed.author.icon_url}`,
						},
						{
							name: '🔹 | Footer Text',
							value: `> ${data.tickets.embed.footer.text}`,
						},
						{
							name: '🔹 | Footer Icon',
							value: `> ${data.tickets.embed.footer.icon_url}`,
						},
						{
							name: '🔹 | Image',
							value: `> ${data.tickets.embed.image.url}`,
						},
					),
			],
			ephemeral: true,
		});
	},
};
