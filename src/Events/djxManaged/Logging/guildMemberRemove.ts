import { dropOffLogs, validate } from '../../../Functions/dropOffLogs.js';
import { EmbedBuilder, GuildMember } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class GuildMemberRemove {
	@On({ event: 'guildMemberRemove' })
	async guildMemberRemove([member]: [GuildMember], client: Evelyn) {
		const { guild, user } = member;

		if (!validate(guild)) return;

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: user.tag,
				iconURL: user.displayAvatarURL(),
			})
			.setTitle('Member Left')
			.addFields(
				{
					name: '🔹 | Member Name',
					value: `> ${user.tag}`,
				},
				{
					name: '🔹 | Member ID',
					value: `> ${user.id}`,
				},
				{
					name: '🔹 | Account Age',
					value: `> <t:${parseInt(
						(user.createdTimestamp / 1000).toString(),
					)}:R>`,
				},
			)
			.setFooter({ text: `${guild.name}` })
			.setTimestamp();

		return dropOffLogs(guild, client, embed);
	}
}
