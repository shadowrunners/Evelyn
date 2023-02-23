// eslint-disable-next-line no-unused-vars
const { GuildChannel, EmbedBuilder, AuditLogEvent } = require('discord.js');
const { webhookDelivery } = require('../../functions/webhookDelivery.js');
const DB = require('../../structures/schemas/guild.js');
const { ChannelCreate } = AuditLogEvent;

module.exports = {
	name: 'channelCreate',
	/**
	 * @param {GuildChannel} channel
	 */
	async execute(channel) {
		const { guild, name, id, createdTimestamp } = channel;

		const data = await DB.findOne({
			id: guild.id,
		});

		if (!data?.logs?.enabled || !data?.logs?.webhook) return;

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
						value: `> <t:${parseInt(createdTimestamp / 1000)}:R>`,
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
