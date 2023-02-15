const { webhookDelivery } = require('../../functions/webhookDelivery.js');
// eslint-disable-next-line no-unused-vars
const { Message, EmbedBuilder, AuditLogEvent } = require('discord.js');
const DB = require('../../structures/schemas/guild.js');
const { MessageDelete } = AuditLogEvent;

module.exports = {
	name: 'messageDelete',
	/**
	 * @param {Message} message
	 */
	async execute(message) {
		const { guild, author, content, createdTimestamp, embeds } = message;

		const data = await DB.findOne({
			id: guild.id,
		});

		if (
			!data.logs.enabled ||
			!data.logs.webhook ||
			author?.bot ||
			embeds.length > 0
		)
			return;

		const fetchLogs = await guild.fetchAuditLogs({
			type: MessageDelete,
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder().setColor('Blurple');

		return webhookDelivery(
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
						value: `> ${message.id}`,
					},
					{
						name: '🔹 | Message sent by',
						value: `> ${author}`,
					},
					{
						name: '🔹 | Deleted at',
						value: `> <t:${parseInt(createdTimestamp / 1000)}:R>`,
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
