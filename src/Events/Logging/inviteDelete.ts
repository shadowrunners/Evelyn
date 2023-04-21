import { Event } from '../../interfaces/interfaces.js';
import { Invite, EmbedBuilder, AuditLogEvent, Guild } from 'discord.js';
import { webhookDelivery } from '../../functions/webhookDelivery.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';

const { InviteDelete } = AuditLogEvent;

const event: Event = {
	name: 'inviteDelete',
	async execute(invite: Invite) {
		const { guild, code } = invite;
		const realGuild = guild as Guild;

		const data = await DB.findOne({
			id: guild.id,
		});

		if (!data?.logs?.enabled || !data?.logs?.webhook) return;

		const fetchLogs = await realGuild.fetchAuditLogs({
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
					iconURL: guild.iconURL(),
				})
				.setTitle('Invite Deleted')
				.addFields(
					{
						name: '🔹 | Invite Link',
						value: `> https://discord.gg/${code}`,
					},
					{
						name: '🔹 | Revoked by',
						value: `> ${firstLog.executor}`,
					},
				)
				.setTimestamp(),
		);
	},
};

export default event;
