import { Event } from '../../interfaces/interfaces.js';
import { GuildMember, EmbedBuilder, AuditLogEvent } from 'discord.js';
import { webhookDelivery } from '../../functions/webhookDelivery.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';

const { MemberBanAdd } = AuditLogEvent;

const event: Event = {
	name: 'guildBanAdd',
	async execute(member: GuildMember) {
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

export default event;
