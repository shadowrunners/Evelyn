import { dropOffLogs, validate } from '../../../Functions/dropOffLogs.js';
import { EmbedBuilder, AuditLogEvent, GuildBan } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class GuildBanAdd {
	@On({ event: 'guildBanAdd' })
	async guildBanAdd([ban]: [GuildBan], client: Evelyn) {
		const { guild, user } = ban;

		if (!validate(guild)) return;

		const fetchLogs = await guild.fetchAuditLogs<AuditLogEvent.MemberBanAdd>({
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: guild.name,
				iconURL: guild.iconURL(),
			})
			.setTitle('Member Banned')
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
					name: '🔹 | Banned by',
					value: `> <@${firstLog.executor.id}>`,
				},
			)
			.setTimestamp();

		return dropOffLogs(guild, client, embed);
	}
}
