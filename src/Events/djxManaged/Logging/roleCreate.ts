import { dropOffLogs, validate } from '../../../Utils/Utils/dropOffLogs.js';
import { Role, EmbedBuilder, AuditLogEvent } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class RoleCreate {
	@On({ event: 'roleCreate' })
	async roleCreate(role: Role, client: Evelyn) {
		const { guild, name, hexColor, id } = role;

		if (!(await validate(guild))) return;

		const fetchLogs = await guild.fetchAuditLogs<AuditLogEvent.RoleCreate>({
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: guild.name,
				iconURL: guild.iconURL(),
			})
			.setTitle('Role Created')
			.addFields(
				{
					name: '🔹 | Role Name',
					value: `> ${name}`,
				},
				{
					name: '🔹 | Role Color',
					value: `> ${hexColor}`,
				},
				{
					name: '🔹 | Role ID',
					value: `> ${id}`,
				},
				{
					name: '🔹 | Role created by',
					value: `> <@${firstLog.executor.id}>`,
				},
			)
			.setTimestamp();

		return dropOffLogs(guild, client, embed);
	}
}
