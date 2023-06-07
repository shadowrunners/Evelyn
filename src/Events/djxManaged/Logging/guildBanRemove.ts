import { dropOffLogs, validate } from '../../../Functions/dropOffLogs.js';
import { EmbedBuilder, AuditLogEvent, GuildBan } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class GuildBanRemove {
	@On({ event: 'guildBanRemove' })
	async guildBanRemove([ban]: [GuildBan], client: Evelyn) {
		const { guild, user } = ban;

		if (!(await validate(guild))) return;

		const fetchLogs = await guild.fetchAuditLogs<AuditLogEvent.MemberBanRemove>(
			{
				limit: 1,
			},
		);
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: guild.name,
				iconURL: guild.iconURL(),
			})
			.setTitle('Member Unbanned')
			.addFields(
				{
					name: '🔹 | Member Name',
					value: `> ${user.username}`,
				},
				{
					name: '🔹 | Member ID',
					value: `> ${user.id}`,
				},
				{
					name: '🔹 | Unbanned by',
					value: `> <@${firstLog.executor.id}>`,
				},
			)
			.setTimestamp();

		return dropOffLogs(guild, client, embed);
	}
}
