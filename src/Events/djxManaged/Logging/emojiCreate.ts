import { dropOffLogs, validate } from '../../../Functions/dropOffLogs.js';
import { EmbedBuilder, AuditLogEvent, GuildEmoji } from 'discord.js';
import { Evelyn } from '../../../Evelyn.js';
import { Discord, On } from 'discordx';

@Discord()
export class EmojiCreate {
	@On({ event: 'emojiCreate' })
	async emojiCreate([emoji]: [GuildEmoji], client: Evelyn) {
		const { guild, name, id } = emoji;

		if (!(await validate(guild))) return;

		const fetchLogs = await guild.fetchAuditLogs<AuditLogEvent.EmojiCreate>({
			limit: 1,
		});
		const firstLog = fetchLogs.entries.first();

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: guild.name,
				iconURL: guild.iconURL(),
			})
			.setTitle('Emoji Created')
			.addFields(
				{
					name: '🔹 | Emoji Name',
					value: `> ${name}`,
				},
				{
					name: '🔹 | Emoji ID',
					value: `> ${id}`,
				},
				{
					name: '🔹 | Added by',
					value: `> <@${firstLog.executor.id}>`,
				},
			)
			.setTimestamp();

		return dropOffLogs(guild, client, embed);
	}
}
