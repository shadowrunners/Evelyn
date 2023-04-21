import { Event } from '../../interfaces/interfaces.js';
import { GuildChannel, EmbedBuilder, AuditLogEvent } from 'discord.js';
import { webhookDelivery } from '../../functions/webhookDelivery.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';

const { ChannelUpdate } = AuditLogEvent;

const event: Event = {
	name: 'channelUpdate',
	async execute(oldChannel: GuildChannel, newChannel: GuildChannel) {
		const { guild } = oldChannel;

		const data = await DB.findOne({
			id: guild.id,
		});

		if (!data?.logs?.enabled || !data?.logs?.webhook) return;

		const fetchLogs = await guild.fetchAuditLogs({
			type: ChannelUpdate,
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder().setColor('Blurple');

		if (oldChannel.name !== newChannel.name)
			return webhookDelivery(
				'logs',
				data,
				embed
					.setAuthor({
						name: guild.name,
						iconURL: guild.iconURL(),
					})
					.setTitle('Channel Name Updated')
					.addFields(
						{
							name: '🔹 | Old Channel Name',
							value: `> ${oldChannel.name}`,
						},
						{
							name: '🔹 | New Channel Name',
							value: `> ${newChannel.name}`,
						},
						{
							name: '🔹 | Updated by',
							value: `> <@${firstLog.executor.id}>`,
						},
					)
					.setTimestamp(),
			);

		if (oldChannel.position !== newChannel.position)
			return webhookDelivery(
				'logs',
				data,
				embed
					.setAuthor({
						name: guild.name,
						iconURL: guild.iconURL(),
					})
					.setTitle('Channel Position Changed')
					.addFields(
						{
							name: '🔹 | Old Channel Position',
							value: `> ${oldChannel.position}`,
						},
						{
							name: '🔹 | New Channel Position',
							value: `> ${newChannel.position}`,
						},
						{
							name: '🔹 | Updated by',
							value: `> <@${firstLog.executor.id}>`,
						},
					)
					.setTimestamp(),
			);

		if (oldChannel.type !== newChannel.type)
			return webhookDelivery(
				'logs',
				data,
				embed
					.setAuthor({
						name: guild.name,
						iconURL: guild.iconURL(),
					})
					.setTitle('Channel Type Changed')
					.addFields(
						{
							name: '🔹 | Old Channel Type',
							value: `> ${oldChannel.type}`,
						},
						{
							name: '🔹 | New Channel Type',
							value: `> ${newChannel.type}`,
						},
						{
							name: '🔹 | Updated by',
							value: `> <@${firstLog.executor.id}>`,
						},
					)
					.setTimestamp(),
			);
	},
};

export default event;
