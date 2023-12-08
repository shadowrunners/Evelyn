import { getAuditLog, send, validate } from '../../../Utils/Helpers/loggerUtils.js';
import { AuditLogEvent, EmbedBuilder, GuildEmoji } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class EmojiDelete {
	@On({ event: 'emojiDelete' })
	async emojiDelete([emoji]: [GuildEmoji], client: Evelyn) {
		if (!(await validate(emoji.guild.id))) return;

		const audit = await getAuditLog({
			type: AuditLogEvent.EmojiDelete,
			guild: emoji.guild,
		});

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: emoji.guild.name,
				iconURL: emoji.guild.iconURL(),
			})
			.setTitle('Emoji Deleted')
			.addFields(
				{
					name: '🔹 | Emoji Name',
					value: `> ${emoji.name}`,
				},
				{
					name: '🔹 | Emoji ID',
					value: `> ${emoji.id}`,
				},
				{
					name: '🔹 | Removed by',
					value: `> ${audit.executor}`,
				},
			);

		return await send({
			guild: emoji.guild.id,
			client,
			embed,
		});
	}
}
