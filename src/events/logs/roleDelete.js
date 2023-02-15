const { webhookDelivery } = require('../../functions/webhookDelivery.js');
// eslint-disable-next-line no-unused-vars
const { Role, EmbedBuilder, AuditLogEvent } = require('discord.js');
const DB = require('../../structures/schemas/guild.js');
const { RoleDelete } = AuditLogEvent;

module.exports = {
	name: 'roleDelete',
	/**
	 * @param {Role} role
	 */
	async execute(role) {
		const { guild, name, id } = role;
		const data = await DB.findOne({ id: guild.id });

		if (!data.logs.enabled || !data.logs.webhook) return;

		const embed = new EmbedBuilder().setColor('Blurple');

		const fetchLogs = await guild.fetchAuditLogs({
			type: RoleDelete,
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		return webhookDelivery(
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
