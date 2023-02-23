// eslint-disable-next-line no-unused-vars
const { GuildMember, EmbedBuilder, AuditLogEvent } = require('discord.js');
const { webhookDelivery } = require('../../functions/webhookDelivery.js');
const DB = require('../../structures/schemas/guild.js');
const { MemberBanAdd } = AuditLogEvent;

module.exports = {
	name: 'guildBanAdd',
	/**
	 * @param {GuildMember} member
	 */
	async execute(member) {
		const { guild, user } = member;

		const data = await DB.findOne({
			id: guild.id,
		});

		if (!data?.logs?.channel || !data?.logs?.webhook) return;

		const fetchLogs = await guild.fetchAuditLogs({
			type: MemberBanAdd,
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
				.setTitle('Member Banned')
				.addFields(
					{
						name: '🔹 | Member Name',
						value: `> ${user.username}`,
					},
					{
						name: '🔹 | Member ID',
						value: `> ${user.id}`,
					},
					{
						name: '🔹 | Banned by',
						value: `> <@${firstLog.executor.id}>`,
					},
				)
				.setTimestamp(),
		);
	},
};
