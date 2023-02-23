const { webhookDelivery } = require('../../functions/webhookDelivery.js');
// eslint-disable-next-line no-unused-vars
const { Role, EmbedBuilder, AuditLogEvent } = require('discord.js');
const DB = require('../../structures/schemas/guild.js');
const { RoleCreate } = AuditLogEvent;

module.exports = {
	name: 'roleCreate',
	/**
	 * @param {Role} role
	 */
	async execute(role) {
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
					iconURL: guild.iconURL({ dynamic: true }),
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
						value: `> <t:${parseInt(createdTimestamp / 1000)}:R>`,
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
