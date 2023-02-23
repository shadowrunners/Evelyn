const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
	subCommand: 'goodbye.manage-embed',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { options, guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');

		await GDB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'goodbye.embed.color': options.getString('color'),
					'goodbye.embed.title': options.getString('title'),
					'goodbye.embed.description': options.getString('description'),
					'goodbye.embed.author.name': options.getString('author-name'),
					'goodbye.embed.author.icon_url': options.getString('author-icon'),
					'goodbye.embed.footer.text': options.getString('footer-text'),
					'goodbye.embed.footer.icon_url': options.getString('footer-icon'),
					'goodbye.embed.image.url': options.getString('image'),
					'goodbye.embed.thumbnail.url': options.getString('thumbnail'),
					'goodbye.embed.messagecontent': options.getString('messagecontent'),
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					'🔹 | Embed has been updated. Run /goodbye preview-embed to see a preview or wait for someone to join.',
				),
			],
			ephemeral: true,
		});
	},
};
