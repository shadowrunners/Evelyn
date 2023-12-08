import { getAuditLog, send, validate } from '../../../Utils/Helpers/loggerUtils.js';
import { AuditLogEvent, EmbedBuilder, GuildEmoji } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class EmojiUpdate {
	@On({ event: 'emojiUpdate' })
	async emojiUpdate(emojis: GuildEmoji, client: Evelyn) {
		const oldEmoji = emojis[0];
		const newEmoji = emojis[1];

		if (!(await validate(oldEmoji.guild))) return;

		const audit = await getAuditLog({
			type: AuditLogEvent.EmojiUpdate,
			guild: oldEmoji.guild,
		});

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
					value: `> ${audit.executor}`,
				},
			);

		if (oldEmoji.name !== newEmoji.name)
			return await send({
				guild: oldEmoji.guild,
				client,
				embed,
			});
	}
}
