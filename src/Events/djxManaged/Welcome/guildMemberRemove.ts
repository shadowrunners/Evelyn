import { replacePlaceholders } from '../../../Functions/replacePlaceholders.js';
import { GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import { GuildDB as DB } from '../../../Schemas/guild.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class Goodbyer {
	@On({ event: 'guildMemberRemove' })
	async execute(member: GuildMember, client: Evelyn) {
		const { guild } = member;

		const data = await DB.findOne({
			id: guild?.id,
		});

		const goodbyeChannel = client.channels.cache.get(
			data?.goodbye?.channel,
		) as TextChannel;

		if (!data?.goodbye?.enabled && !goodbyeChannel && !data?.welcome?.embed)
			return;

		const embed = data.goodbye.embed;
		const content = data.goodbye.embed.messagecontent;

		const goodbyeMessage = replacePlaceholders(content, member);
		const goodbyeEmbed = new EmbedBuilder();

		if (embed?.color) {
			const hexCodeRegex = /^#[0-9A-Fa-f]{6}$/;
			if (hexCodeRegex.test(embed.color)) goodbyeEmbed.setColor(embed.color);
		}

		if (embed?.title) goodbyeEmbed.setTitle(embed.title);

		if (embed?.description)
			goodbyeEmbed.setDescription(
				replacePlaceholders(embed.description, member),
			);

		if (embed?.author)
			goodbyeEmbed.setAuthor({
				name: replacePlaceholders(embed.author.name, member),
				iconURL: embed.author.icon_url,
			});

		if (embed?.footer)
			goodbyeEmbed.setFooter({
				text: replacePlaceholders(embed.footer.text, member),
				iconURL: embed.footer.icon_url,
			});

		if (embed.image?.url) goodbyeEmbed.setImage(embed.image?.url);
		if (embed.thumbnail?.url) goodbyeEmbed.setThumbnail(embed.thumbnail?.url);

		if (content)
			goodbyeChannel.send({
				content: goodbyeMessage,
				embeds: [goodbyeEmbed],
			});
		else
			goodbyeChannel.send({
				embeds: [goodbyeEmbed],
			});
	}
}
