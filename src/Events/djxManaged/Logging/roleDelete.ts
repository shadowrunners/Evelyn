import { dropOffLogs, validate } from '../../../Functions/dropOffLogs.js';
import { Role, EmbedBuilder, AuditLogEvent } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class RoleCreate {
	@On({ event: 'roleCreate' })
	async roleCreate(role: Role, client: Evelyn) {
		const { guild, name, id } = role;

		if (!(await validate(guild))) return;

		const fetchLogs = await guild.fetchAuditLogs<AuditLogEvent.RoleDelete>({
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({ name: guild.name, iconURL: guild.iconURL() })
			.setTitle('Role Deleted')
			.addFields(
				{
					name: '🔹 | Role Name',
					value: `> ${name}`,
				},
				{
					name: '🔹 | Role ID',
					value: `> ${id}`,
				},
				{
					name: '🔹 | Role deleted by',
					value: `> <@${firstLog.executor.id}>`,
				},
			)
			.setTimestamp();

		return dropOffLogs(guild, client, embed);
	}
}
