import { Event } from '../../interfaces/interfaces.js';
import { GuildChannel, EmbedBuilder, AuditLogEvent } from 'discord.js';
import { webhookDelivery } from '../../functions/webhookDelivery.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';

const { ChannelCreate } = AuditLogEvent;

const event: Event = {
	name: 'channelCreate',
	async execute(channel: GuildChannel) {
		const { guild, name, id, createdTimestamp } = channel;

		const data = await DB.findOne({
			id: guild.id,
		});

		if (!data?.logs?.enabled ?? !data?.logs?.webhook) return;

		const fetchLogs = await guild.fetchAuditLogs({
			type: ChannelCreate,
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
				.setTitle('Channel Created')
				.addFields(
					{
						name: '🔹 | Channel Name',
						value: `> ${name}`,
					},
					{
						name: '🔹 | ID',
						value: `> ${id}`,
					},
					{
						name: '🔹 | Created at',
						value: `> <t:${createdTimestamp / 1000}:R>`,
					},
					{
						name: '🔹 | Created by',
						value: `> <@${firstLog.executor.id}>`,
					},
				)
				.setTimestamp(),
		);
	},
};

export default event;
