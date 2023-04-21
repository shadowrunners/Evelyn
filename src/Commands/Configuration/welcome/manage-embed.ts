import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { RRoles as DB } from '../../../structures/schemas/roles.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'welcome.manage-embed',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'welcome.embed.color': options.getString('color'),
					'welcome.embed.title': options.getString('title'),
					'welcome.embed.description': options.getString('description'),
					'welcome.embed.author.name': options.getString('author-name'),
					'welcome.embed.author.icon_url': options.getString('author-icon'),
					'welcome.embed.footer.text': options.getString('footer-text'),
					'welcome.embed.footer.icon_url': options.getString('footer-icon'),
					'welcome.embed.image.url': options.getString('image'),
					'welcome.embed.thumbnail.url': options.getString('thumbnail'),
					'welcome.embed.messageContent': options.getString('messageContent'),
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					'🔹 | Embed has been updated. Run /welcome embed-preview to see a preview or wait for someone to join.',
				),
			],
			ephemeral: true,
		});
	},
};

export default subCommand;
