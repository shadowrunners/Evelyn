import { Event } from '../../interfaces/interfaces.js';
import { Role, EmbedBuilder, AuditLogEvent } from 'discord.js';
import { webhookDelivery } from '../../functions/webhookDelivery.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';

const { RoleDelete } = AuditLogEvent;

const event: Event = {
	name: 'roleDelete',
	async execute(role: Role) {
		const { guild, name, id } = role;
		const data = await DB.findOne({ id: guild.id });

		if (!data?.logs?.enabled || !data?.logs?.webhook) return;

		const embed = new EmbedBuilder().setColor('Blurple');

		const fetchLogs = await guild.fetchAuditLogs({
			type: RoleDelete,
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		return webhookDelivery(
			'logs',
			data,
			embed
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
				.setTimestamp(),
		);
	},
};

export default event;
