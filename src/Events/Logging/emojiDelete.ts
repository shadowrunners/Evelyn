import { Event } from '../../interfaces/interfaces.js';
import { GuildEmoji, EmbedBuilder, AuditLogEvent } from 'discord.js';
import { webhookDelivery } from '../../functions/webhookDelivery.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';

const { EmojiDelete } = AuditLogEvent;

const event: Event = {
	name: 'emojiDelete',
	async execute(emoji: GuildEmoji) {
		const { guild, name, id } = emoji;

		const data = await DB.findOne({
			id: guild.id,
		});

		if (!data?.logs?.enabled || !data?.logs?.webhook) return;

		const fetchLogs = await guild.fetchAuditLogs({
			type: EmojiDelete,
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
				.setTitle('Emoji Deleted')
				.addFields(
					{
						name: '🔹 | Name',
						value: `> ${name}`,
					},
					{
						name: '🔹 | ID',
						value: `> ${id}`,
					},
					{
						name: '🔹 | Removed by',
						value: `> <@${firstLog.executor.id}>`,
					},
				)
				.setTimestamp(),
		);
	},
};

export default event;
