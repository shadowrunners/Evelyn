import { Event } from '../../interfaces/interfaces.js';
import { Message, EmbedBuilder, AuditLogEvent } from 'discord.js';
import { webhookDelivery } from '../../functions/webhookDelivery.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';

const { MessageDelete } = AuditLogEvent;

const event: Event = {
	name: 'messageDelete',
	async execute(message: Message) {
		const { guild, author, content, createdTimestamp, embeds, id } = message;

		const data = await DB.findOne({
			id: guild.id,
		});

		if (
			!data?.logs?.enabled ||
			!data?.logs?.webhook ||
			author?.bot ||
			embeds?.length > 0
		)
			return;

		const fetchLogs = await guild.fetchAuditLogs({
			type: MessageDelete,
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
				.setTitle('Message Deleted')
				.addFields(
					{
						name: '🔹 | Message Content',
						value: `> ${content}`,
					},
					{
						name: '🔹 | ID',
						value: `> ${id}`,
					},
					{
						name: '🔹 | Message sent by',
						value: `> ${author}`,
					},
					{
						name: '🔹 | Deleted at',
						value: `> <t:${createdTimestamp / 1000}:R>`,
					},
					{
						name: '🔹 | Deleted by',
						value: `> <@${firstLog.executor.id}>`,
					},
				)
				.setTimestamp(),
		);
	},
};

export default event;
