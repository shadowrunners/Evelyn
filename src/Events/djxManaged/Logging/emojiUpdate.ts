import { dropOffLogs, validate } from '../../../Functions/dropOffLogs.js';
import { EmbedBuilder, AuditLogEvent, GuildEmoji } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class EmojiUpdate {
	@On({ event: 'emojiUpdate' })
	async emojiUpdate(emojis: GuildEmoji, client: Evelyn) {
		const oldEmoji = emojis[0] as GuildEmoji;
		const newEmoji = emojis[1] as GuildEmoji;

		if (!(await validate(oldEmoji.guild))) return;

		const fetchLogs =
			await oldEmoji.guild.fetchAuditLogs<AuditLogEvent.EmojiUpdate>({
				limit: 1,
			});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: oldEmoji.guild.name,
				iconURL: oldEmoji.guild.iconURL(),
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
			.setTimestamp();

		if (oldEmoji.name !== newEmoji.name)
			return dropOffLogs(oldEmoji.guild, client, embed);
	}
}
