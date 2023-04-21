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
	subCommand: 'goodbye.preview-embed',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId, member } = interaction;
		const channel = options.getChannel('channel') as TextChannel;
		const data = await DB.findOne({ id: guildId });
		const typedMember = member as GuildMember;

		const nEmbed = new EmbedBuilder().setColor('Blurple');

		const embed = data.goodbye.embed;
		const goodbyeEmbed = new EmbedBuilder();
		const content = data.goodbye.embed.messagecontent;
		const goodbyeMessage = replacePlaceholders(content, typedMember);

		if (embed.color) {
			const hexCodeRegex = /^#[0-9A-Fa-f]{6}$/;
			if (hexCodeRegex.test(embed.color)) goodbyeEmbed.setColor(embed.color);
		}

		if (embed.title) goodbyeEmbed.setTitle(embed.title);

		if (embed.description)
			goodbyeEmbed.setDescription(
				replacePlaceholders(embed.description, member as GuildMember) ||
					'Undefined',
			);

		if (embed.author)
			goodbyeEmbed.setAuthor({
				name:
					replacePlaceholders(embed.author.name, typedMember) || 'Undefined',
				iconURL: embed.author.icon_url,
			});

		if (embed.footer)
			goodbyeEmbed.setFooter({
				text:
					replacePlaceholders(embed.footer.text, typedMember) || 'Undefined',
				iconURL: embed.footer.icon_url,
			});

		if (embed.image?.url) goodbyeEmbed.setImage(embed.image?.url);
		if (embed.thumbnail?.url) goodbyeEmbed.setThumbnail(embed.thumbnail.url);

		if (content)
			channel.send({
				content: goodbyeMessage,
				embeds: [goodbyeEmbed],
			});
		else
			channel.send({
				embeds: [goodbyeEmbed],
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
