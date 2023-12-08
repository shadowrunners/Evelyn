import { replacePlaceholders } from '../../../Utils/Helpers/replacePlaceholders.js';
import { GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import { GuildDB as DB } from '../../../Schemas/guild.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class Welcomer {
	@On({ event: 'guildMemberAdd' })
	async execute(member: GuildMember, client: Evelyn) {
		const { guild } = member;

		const data = await DB.findOne({
			id: guild?.id,
		});

		const welcomeChannel = client.channels.cache.get(
			data?.welcome?.channel,
		) as TextChannel;

		if (!data?.welcome?.enabled || !welcomeChannel || !data?.welcome?.embed)
			return;

		const embed = data.welcome.embed;
		const content = data.welcome.embed.content;

		const welcomeMessage = replacePlaceholders(content, member);
		const welcomeEmbed = new EmbedBuilder();

		if (embed?.color) {
			const hexCodeRegex = /^#[0-9A-Fa-f]{6}$/;
			if (hexCodeRegex.test(embed.color)) welcomeEmbed.setColor(embed.color);
		}

		if (embed?.title) welcomeEmbed.setTitle(embed.title);

		if (embed?.description)
			welcomeEmbed.setDescription(
				replacePlaceholders(embed.description, member),
			);

		if (embed?.author)
			welcomeEmbed.setAuthor({
				name: replacePlaceholders(embed.author.name, member),
				iconURL: embed.author.icon_url,
			});

		if (embed?.footer)
			welcomeEmbed.setFooter({
				text: replacePlaceholders(embed.footer.text, member),
				iconURL: embed.footer.icon_url,
			});

		if (embed.image?.url) welcomeEmbed.setImage(embed.image?.url);
		if (embed.thumbnail?.url) welcomeEmbed.setThumbnail(embed.thumbnail?.url);

		if (content)
			welcomeChannel.send({
				content: welcomeMessage,
				embeds: [welcomeEmbed],
			});
		else
			welcomeChannel.send({
				embeds: [welcomeEmbed],
			});
	}
}
