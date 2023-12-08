import { send, validate, getAuditLog } from '../../../Utils/Helpers/loggerUtils.js';
import { EmbedBuilder, Role, AuditLogEvent } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class RoleDelete {
	@On({ event: 'roleDelete' })
	async roleDelete([role]: [Role], client: Evelyn) {
		if (!await validate(role.guild.id)) return;

		const audit = await getAuditLog({
			type: AuditLogEvent.RoleDelete,
			guild: role.guild,
		});

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: role.guild.name,
				iconURL: role.guild.iconURL(),
			})
			.setTitle('Role Deleted')
			.addFields(
				{
					name: '🔹 | Name',
					value: `> ${role.name}`,
				},
				{
					name: '🔹 | ID',
					value: `> ${role.id}`,
				},
				{
					name: '🔹 | Deleted by',
					value: `> ${audit.executor}`,
				},
			)
			.setTimestamp();

		return await send({
			guild: role.guild.id,
			client,
			embed,
		});
	}
}
