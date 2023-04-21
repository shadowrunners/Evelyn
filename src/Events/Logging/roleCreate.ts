import { Event } from '../../interfaces/interfaces.js';
import { Role, EmbedBuilder, AuditLogEvent } from 'discord.js';
import { webhookDelivery } from '../../functions/webhookDelivery.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';

const { RoleCreate } = AuditLogEvent;

const event: Event = {
	name: 'roleCreate',
	async execute(role: Role) {
		const { guild, name, hexColor, id, createdTimestamp } = role;

		const data = await DB.findOne({
			id: guild.id,
		});

		if (!data?.logs?.enabled || !data?.logs?.webhook) return;

		const fetchLogs = await guild.fetchAuditLogs({
			type: RoleCreate,
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder().setColor('Blurple');

		return webhookDelivery(
			'logs',
			data,
			embed
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
						name: '🔹 | Role created at',
						value: `> <t:${createdTimestamp / 1000}:R>`,
					},
					{
						name: '🔹 | Role created by',
						value: `> <@${firstLog.executor.id}>`,
					},
				)
				.setTimestamp(),
		);
	},
};

export default event;
