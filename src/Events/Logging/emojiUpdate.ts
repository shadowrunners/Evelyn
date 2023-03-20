import { Event } from '../../interfaces/interfaces.js';
import { GuildEmoji, EmbedBuilder, AuditLogEvent } from 'discord.js';
import { webhookDelivery } from '../../functions/webhookDelivery.js';
import { GuildDB as DB } from '../../structures/schemas/guild.js';

const { EmojiUpdate } = AuditLogEvent;

const event: Event = {
	name: 'emojiUpdate',
	async execute(oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {
		const { guild } = oldEmoji;

		const data = await DB.findOne({
			id: guild.id,
		});

		if (!data?.logs?.enabled || !data?.logs?.webhook) return;

		const fetchLogs = await guild.fetchAuditLogs({
			type: EmojiUpdate,
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder().setColor('Blurple');

		if (oldEmoji.name !== newEmoji.name)
			return webhookDelivery(
				'logs',
				data,
				embed
					.setAuthor({
						name: guild.name,
						iconURL: guild.iconURL(),
					})
					.setTitle('Emoji Updated')
					.addFields(
						{
							name: '🔹 | Old Name',
							value: `> ${oldEmoji.name}`,
						},
						{
							name: '🔹 | New Name',
							value: `> ${newEmoji.name}`,
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

export default event;
