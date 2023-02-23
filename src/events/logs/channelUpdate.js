// eslint-disable-next-line no-unused-vars
const { GuildChannel, EmbedBuilder, AuditLogEvent } = require('discord.js');
const { webhookDelivery } = require('../../functions/webhookDelivery.js');
const DB = require('../../structures/schemas/guild.js');
const { ChannelUpdate } = AuditLogEvent;

module.exports = {
	name: 'channelUpdate',
	/**
	 * @param {GuildChannel} oldChannel
	 * @param {GuildChannel} newChannel
	 */
	async execute(oldChannel, newChannel) {
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

		if (oldChannel.topic !== newChannel.topic)
			return webhookDelivery(
				'logs',
				data,
				embed
					.setAuthor({
						name: guild.name,
						iconURL: guild.iconURL(),
					})
					.setTitle('Channel Topic Updated')
					.addFields(
						{
							name: '🔹 | Old Channel Topic',
							value: `> ${oldChannel.topic}`,
						},
						{
							name: '🔹 | New Channel Topic',
							value: `> ${newChannel.topic}`,
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
