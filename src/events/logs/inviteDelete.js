const { webhookDelivery } = require('../../functions/webhookDelivery.js');
// eslint-disable-next-line no-unused-vars
const { Invite, EmbedBuilder, AuditLogEvent } = require('discord.js');
const DB = require('../../structures/schemas/guild.js');
const { InviteDelete } = AuditLogEvent;

module.exports = {
	name: 'inviteDelete',
	/**
	 * @param {Invite} invite
	 */
	async execute(invite) {
		const { guild, code } = invite;

		const data = await DB.findOne({
			id: guild.id,
		});

		if (!data?.logs?.enabled || !data?.logs?.webhook) return;

		const fetchLogs = await guild.fetchAuditLogs({
			type: InviteDelete,
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
				.setTitle('Invite Deleted')
				.addFields(
					{
						name: '🔹 | Invite Link',
						value: `> https://discord.gg/${code}`,
					},
					{
						name: '🔹 | Revoked by',
						value: `> <@${firstLog.executor.id}>`,
					},
				)
				.setTimestamp(),
		);
	},
};
