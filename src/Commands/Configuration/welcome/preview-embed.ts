import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
	TextChannel,
} from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';
import { replacePlaceholders } from '../../../functions/replacePlaceholders.js';

const subCommand: Subcommand = {
	subCommand: 'welcome.preview-embed',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId, member } = interaction;
		const channel = options.getChannel('channel') as TextChannel;
		const data = await DB.findOne({ id: guildId });
		const typedMember = member as GuildMember;

		const nEmbed = new EmbedBuilder().setColor('Blurple');

		const embed = data.welcome.embed;
		const welcomeEmbed = new EmbedBuilder();
		const content = data.welcome.embed.messagecontent;
		const welcomeMessage = replacePlaceholders(content, typedMember);

		if (embed.color) {
			const hexCodeRegex = /^#[0-9A-Fa-f]{6}$/;
			if (hexCodeRegex.test(embed.color)) welcomeEmbed.setColor(embed.color);
		}

		if (embed.title) welcomeEmbed.setTitle(embed.title);

		if (embed.description)
			welcomeEmbed.setDescription(
				replacePlaceholders(embed.description, typedMember) || 'Undefined',
			);

		if (embed.author)
			welcomeEmbed.setAuthor({
				name:
					replacePlaceholders(embed.author.name, typedMember) || 'Undefined',
				iconURL: embed.author.icon_url,
			});

		if (embed.footer)
			welcomeEmbed.setFooter({
				text:
					replacePlaceholders(embed.footer.text, typedMember) || 'Undefined',
				iconURL: embed.footer.icon_url,
			});

		if (embed.image?.url) welcomeEmbed.setImage(embed.image?.url);
		if (embed.thumbnail?.url) welcomeEmbed.setThumbnail(embed.thumbnail.url);

		if (content)
			channel.send({
				content: welcomeMessage,
				embeds: [welcomeEmbed],
			});
		else
			channel.send({
				embeds: [welcomeEmbed],
			});

		return interaction.reply({
			embeds: [
				nEmbed.setDescription(
					`🔹 | Preview has been sent to <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	},
};
export default subCommand;
